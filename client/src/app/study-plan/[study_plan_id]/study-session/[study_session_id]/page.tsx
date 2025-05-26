import StudyPlan from "@/types/study-plan";
import StudySession from "@/types/study-session";
import Link from "next/link";

async function fetchStudySession(study_plan_id: number, study_session_id: number): Promise<StudySession> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/study-plan`);
  return (await res.json()).find(
    (studyPlan: StudyPlan) => studyPlan.id === study_plan_id
  ).study_sessions.find(
    (studySession: StudySession) => studySession.id === study_session_id
  )
}

export default async function StudySessionPage({ params }: { params: Promise<{ study_plan_id: string, study_session_id: string }> }) {
    const { study_plan_id, study_session_id } = await params;

    const studySession = await fetchStudySession(Number(study_plan_id), Number(study_session_id));

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <header className="row-start-1 text-center">
                <h1 className="text-4xl font-bold">
                    Study Session {studySession?.id}
                </h1>
            </header>
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                {studySession?.study_questions.map((studyQuestion) => (
                    <Link key={studyQuestion.id} href={`/study-plan/${study_plan_id}/study-session/${study_session_id}/study-question/${studyQuestion.id}`}>
                        {studyQuestion.question}
                    </Link>
                ))}
            </main>
        </div>
    );
}