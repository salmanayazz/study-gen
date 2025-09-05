import type { StudyPlan } from "@/types/study-plan";
import type { StudyQuestion } from "@/types/study-question";
import type { StudySession } from "@/types/study-session";
import Link from "next/link";

async function fetchStudySession(course_id: string, study_plan_id: string, study_session_id: string): Promise<StudySession | undefined> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/course/${course_id}/study-plan`)

  if (!res.ok) {
    return undefined;
  }

  return (await res.json()).find(
    (studyPlan: StudyPlan) => studyPlan.id === Number(study_plan_id)
  ).study_sessions.find(
    (studySession: StudySession) => studySession.id === Number(study_session_id)
  )
}

export default async function StudySessionPage({ params }: { params: Promise<{ course_id: string, study_plan_id: string, study_session_id: string }> }) {
  const { course_id, study_plan_id, study_session_id } = await params;

  const studySession = await fetchStudySession(course_id, study_plan_id, study_session_id);

  return (
    <div>
      <header>
        <h1>
          Study Session {studySession?.id}
        </h1>
      </header>
      <main className="flex flex-col">
        {studySession?.study_questions.map((studyQuestion: StudyQuestion) => (
          <Link key={studyQuestion.id} href={`/course/${course_id}/study-plan/${study_plan_id}/study-session/${study_session_id}/study-question/${studyQuestion.id}`}>
            {studyQuestion.question}
          </Link>
        ))}
      </main>
    </div>
  );
}