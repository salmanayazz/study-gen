import StudyPlan from "@/types/study-plan";
import StudySession from "@/types/study-session";
import StudyQuestion from "@/types/study-question";
import StudyQuestionForm from "./StudyQuestionForm";

export async function fetchStudyQuestion(study_plan_id: number, study_session_id: number, study_question_id: number): Promise<StudyQuestion> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/study-plan`);
  return (await res.json()).find(
    (studyPlan: StudyPlan) => studyPlan.id === study_plan_id
  ).study_sessions.find(
    (studySession: StudySession) => studySession.id === study_session_id
  ).study_questions.find(
    (studyQuestion: StudyQuestion) => studyQuestion.id === study_question_id
  );
}

export async function answerStudyQuestion(studyPlanId: number, studySessionId: number, studyQuestionId: number, userAnswer: string): Promise<boolean | null> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/study-plan/${studyPlanId}/study-session/${studySessionId}/study-question/${studyQuestionId}/user-answer`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_answer: userAnswer
      })
    });

    return (await response.json()).correct;
}

export default async function StudyQuestionPage({ params }: { params: Promise<{ study_plan_id: string, study_session_id: string, study_question_id: string }> }) {
    const { study_plan_id, study_session_id, study_question_id } = await params;

    const studyQuestion = await fetchStudyQuestion(Number(study_plan_id), Number(study_session_id), Number(study_question_id));

    return (
        <div className="flex flex-col">
            <h2>
                {studyQuestion?.question}
            </h2>

            <StudyQuestionForm
                studyPlanId={Number(study_plan_id)}
                studySessionId={Number(study_session_id)}
                studyQuestionId={Number(study_question_id)}
                studyQuestion={studyQuestion}
            />
            
        </div>
    );
}