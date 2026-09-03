import { QuizQuestion } from '../types';

export interface FormExportResult {
  formId: string;
  responderUri: string;
  editUrl: string;
  formTitle: string;
  sectionName?: string;
  facultyName?: string;
  sharedWithEmail?: string;
}

export interface FacultyOption {
  facultyName: string;
  facultyEmail?: string;
  sectionName?: string;
}

export interface BatchFormExportResult {
  results: FormExportResult[];
  errors: Array<{ facultyName: string; sectionName?: string; error: string }>;
}

/**
  Creates a Google Form, converts it into a graded Quiz with questions and correct answers,
  and automatically shares EDIT access with the assigned section faculty member.
  
  Note: Per Google Forms API requirements, the initial POST /v1/forms request body contains
  ONLY info.title. Description, quiz settings, and questions are added subsequently via batchUpdate.
  Then, Drive API permissions endpoint is called to add the faculty member as an editor ('writer').
 */
export async function createGoogleFormQuiz(
  accessToken: string,
  quizTitle: string,
  questions: QuizQuestion[],
  options?: FacultyOption
): Promise<FormExportResult> {
  const fullTitle = quizTitle.trim() || 'Module-1-TOC-5B-26-27';

  const facultyIdentifier = options?.facultyName
    ? `${options.facultyName}${options.sectionName ? ` [${options.sectionName}]` : ''}`
    : 'Faculty Member';

  const descriptionLines = [
    `Formal Languages & Automata Theory - Course Assessment`,
    options?.sectionName ? `Class Section: ${options.sectionName}` : null,
    options?.facultyName ? `Course Faculty: ${options.facultyName}` : null,
    options?.facultyEmail ? `Contact Email: ${options.facultyEmail}` : null,
    `Please answer all questions and submit your response.`,
  ].filter(Boolean).join('\n');

  // 1. Create the Form under central account (Must contain ONLY info.title as per Google Forms API spec)
  let createResponse: Response;
  try {
    createResponse = await fetch('https://forms.googleapis.com/v1/forms', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        info: {
          title: fullTitle,
        },
      }),
    });
  } catch (err: any) {
    throw new Error(`Network error creating Google Form for ${facultyIdentifier}: ${err.message}`);
  }

  if (!createResponse.ok) {
    const errText = await createResponse.text();
    console.error(`Google Forms API create error for ${facultyIdentifier}:`, errText);
    throw new Error(`Failed to create Google Form for ${facultyIdentifier}: ${createResponse.statusText}. (${errText})`);
  }

  const formData = await createResponse.json();
  const formId = formData.formId;
  const initialResponderUri = formData.responderUri || `https://docs.google.com/forms/d/e/${formId}/viewform`;
  const editUrl = `https://docs.google.com/forms/d/${formId}/edit`;

  // 2. Prepare batchUpdate requests to set description, enable Quiz mode, and populate questions
  const requests: any[] = [];

  // Update Form Description if available
  if (descriptionLines) {
    requests.push({
      updateFormInfo: {
        info: {
          description: descriptionLines,
        },
        updateMask: 'description',
      },
    });
  }

  // Convert Form into a Graded Quiz
  requests.push({
    updateSettings: {
      settings: {
        quizSettings: {
          isQuiz: true,
        },
      },
      updateMask: 'quizSettings.isQuiz',
    },
  });

  // Add all quiz questions
  questions.forEach((q, idx) => {
    const correctAnswerText = q.options[q.correctAnswer];

    requests.push({
      createItem: {
        item: {
          title: `${idx + 1}. ${q.question}`,
          description: q.explanation ? `Explanation: ${q.explanation}` : undefined,
          questionItem: {
            question: {
              required: true,
              grading: {
                pointValue: 1,
                correctAnswers: {
                  answers: [
                    {
                      value: correctAnswerText,
                    },
                  ],
                },
              },
              choiceQuestion: {
                type: 'RADIO',
                options: q.options.map((opt) => ({ value: opt })),
                shuffle: false,
              },
            },
          },
        },
        location: {
          index: idx,
        },
      },
    });
  });

  // Send batchUpdate to apply settings & questions
  let updateResponse: Response;
  try {
    updateResponse = await fetch(`https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests }),
    });
  } catch (err: any) {
    throw new Error(`Network error populating questions for ${facultyIdentifier}: ${err.message}`);
  }

  if (!updateResponse.ok) {
    const errText = await updateResponse.text();
    console.error(`Google Forms API batchUpdate error for ${facultyIdentifier}:`, errText);
    throw new Error(`Form created for ${facultyIdentifier}, but failed to populate questions: ${updateResponse.statusText}. (${errText})`);
  }

  const updatedData = await updateResponse.json();
  const finalResponderUri = updatedData.form?.responderUri || initialResponderUri;

  // 3. Automatically share Form Edit access with the assigned Section Faculty Email via Google Drive API
  let sharedWithEmail: string | undefined;
  if (options?.facultyEmail && options.facultyEmail.includes('@')) {
    try {
      const shareRes = await fetch(
        `https://www.googleapis.com/drive/v3/files/${formId}/permissions?sendNotificationEmail=true`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            role: 'writer',
            type: 'user',
            emailAddress: options.facultyEmail.trim(),
          }),
        }
      );
      if (shareRes.ok) {
        sharedWithEmail = options.facultyEmail.trim();
      } else {
        const shareErr = await shareRes.text();
        console.warn(`Drive API permission notice for ${options.facultyEmail}:`, shareErr);
      }
    } catch (shareErr) {
      console.warn(`Drive API permission error for ${options.facultyEmail}:`, shareErr);
    }
  }

  return {
    formId,
    responderUri: finalResponderUri,
    editUrl,
    formTitle: fullTitle,
    sectionName: options?.sectionName,
    facultyName: options?.facultyName,
    sharedWithEmail,
  };
}

/**
  Creates Google Forms for multiple faculty members independently.
  Iterates over each faculty option, creating a form with title -> retrieving formId -> batchUpdate -> sharing with assigned faculty -> saving results.
  Captures errors individually so one failure does not prevent other forms from being created.
 */
export async function createGoogleFormsForFacultyList(
  accessToken: string,
  quizTitle: string,
  questions: QuizQuestion[],
  facultyList: FacultyOption[]
): Promise<BatchFormExportResult> {
  const results: FormExportResult[] = [];
  const errors: Array<{ facultyName: string; sectionName?: string; error: string }> = [];

  for (const faculty of facultyList) {
    try {
      const result = await createGoogleFormQuiz(accessToken, quizTitle, questions, faculty);
      results.push(result);
    } catch (err: any) {
      errors.push({
        facultyName: faculty.facultyName,
        sectionName: faculty.sectionName,
        error: err.message || 'Unknown error',
      });
    }
  }

  return { results, errors };
}


