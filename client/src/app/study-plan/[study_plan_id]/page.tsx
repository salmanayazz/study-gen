import StudyPlan from "@/types/study-plan";
import StudySession from "@/types/study-session";
import Link from "next/link";

async function fetchStudyPlan(study_plan_id: number): Promise<StudyPlan> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/study-plan`);
  return (await res.json()).find((studyPlan: StudyPlan) => studyPlan.id === study_plan_id);
}

export default async function StudyPlanPage({ params }: { params: Promise<{study_plan_id: string }> }) {
    const { study_plan_id } = await params;

    const studyPlan = await fetchStudyPlan(Number(study_plan_id))

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <header className="row-start-1 text-center">
                <h1 className="text-4xl font-bold">
                    Study Plan {studyPlan?.id}
                </h1>
            </header>
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                {studyPlan?.study_sessions.map((studySession: StudySession) => (
                    <Link key={studySession.id} href={`/study-plan/${studyPlan.id}/study-session/${studySession.id}`}>
                        <button>
                            {studySession.id}
                        </button>
                    </Link>
                ))}
            </main>
        </div>
    );
}