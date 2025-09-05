import type { StudyPlan } from "@/types/study-plan";
import type { StudyQuestion } from "@/types/study-question";
import type { StudySession } from "@/types/study-session";
import StudyQuestionForm from "./StudyQuestionForm";

export async function fetchStudyQuestion(course_id: string, study_plan_id: string, study_session_id: string, study_question_id: string): Promise<StudyQuestion | undefined> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/course/${course_id}/study-plan`);

  if (!res.ok) {
    return undefined;
  }

  return (await res.json()).find(
    (studyPlan: StudyPlan) => studyPlan.id === Number(study_plan_id)
  ).study_sessions.find(
    (studySession: StudySession) => studySession.id === Number(study_session_id)
  ).study_questions.find(
    (studyQuestion: StudyQuestion) => studyQuestion.id === Number(study_question_id)
  );
}

export async function answerStudyQuestion(course_id: string, studyPlanId: string, studySessionId: string, studyQuestionId: string, userAnswer: string): Promise<boolean | null> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/course/${course_id}/study-plan/${studyPlanId}/study-session/${studySessionId}/study-question/${studyQuestionId}/user-answer`, {
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

export default async function StudyQuestionPage({ params }: { params: Promise<{ course_id: string, study_plan_id: string, study_session_id: string, study_question_id: string }> }) {
  const { course_id, study_plan_id, study_session_id, study_question_id } = await params;

  const studyQuestion = await fetchStudyQuestion(course_id, study_plan_id, study_session_id, study_question_id);

  return (
    <div className="flex flex-col">
      <h2>
        {studyQuestion?.question}
      </h2>

      <StudyQuestionForm
        courseId={course_id}
        studyPlanId={study_plan_id}
        studySessionId={study_session_id}
        studyQuestionId={study_question_id}
        studyQuestion={studyQuestion}
      />
        
    </div>
  );
}