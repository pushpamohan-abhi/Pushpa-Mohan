import { QuizQuestion } from '../types';

export interface FormExportResult {
  formId: string;
  responderUri: string;
  editUrl: string;
}

/**
  Creates a Google Form and converts it into a graded Quiz with questions and correct answers.
 */
export async function createGoogleFormQuiz(
  accessToken: string,
  quizTitle: string,
  questions: QuizQuestion[]
): Promise<FormExportResult> {
  // 1. Create the Form
  const createResponse = await fetch('https://forms.googleapis.com/v1/forms', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      info: {
        title: quizTitle,
        documentTitle: quizTitle,
      },
    }),
  });

  if (!createResponse.ok) {
    const errText = await createResponse.text();
    console.error('Google Forms API create error:', errText);
    throw new Error(`Failed to create Google Form: ${createResponse.statusText}. (${errText})`);
  }

  const formData = await createResponse.json();
  const formId = formData.formId;
  const initialResponderUri = formData.responderUri || `https://docs.google.com/forms/d/e/${formId}/viewform`;
  const editUrl = `https://docs.google.com/forms/d/${formId}/edit`;

  // 2. Prepare batchUpdate requests to turn form into a Quiz and populate questions
  const requests: any[] = [
    {
      updateSettings: {
        settings: {
          quizSettings: {
            isQuiz: true,
          },
        },
        updateMask: 'quizSettings.isQuiz',
      },
    },
  ];

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

  // 3. Send batchUpdate
  const updateResponse = await fetch(`https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ requests }),
  });

  if (!updateResponse.ok) {
    const errText = await updateResponse.text();
    console.error('Google Forms API batchUpdate error:', errText);
    throw new Error(`Form created, but failed to populate questions: ${updateResponse.statusText}. (${errText})`);
  }

  const updatedData = await updateResponse.json();
  const finalResponderUri = updatedData.form?.responderUri || initialResponderUri;

  return {
    formId,
    responderUri: finalResponderUri,
    editUrl,
  };
}
