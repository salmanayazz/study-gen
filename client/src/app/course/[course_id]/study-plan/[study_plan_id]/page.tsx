import type { StudyPlan } from "@/types/study-plan";
import type { StudySession } from "@/types/study-session";
import Link from "next/link";

async function fetchStudyPlan(course_id: string, study_plan_id: string): Promise<StudyPlan | undefined> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/course/${course_id}/study-plan`);

  if (!res.ok) {
    return undefined;
  }

  return (await res.json()).find((studyPlan: StudyPlan) => studyPlan.id === Number(study_plan_id));
}

export default async function StudyPlanPage({ params }: { params: Promise<{ course_id: string, study_plan_id: string }> }) {
  const { course_id, study_plan_id } = await params;

  const studyPlan = await fetchStudyPlan(course_id, study_plan_id);
  console.log(studyPlan);

  return (
    <div>
      <header>
        <h1>
          Study Plan {studyPlan?.id}
        </h1>
      </header>
      <main className="flex flex-col">
        <h2>
          Study Sessions:
        </h2>
        {studyPlan?.study_sessions.map((studySession: StudySession) => (
          <Link key={studySession.id} href={`/course/${course_id}/study-plan/${studyPlan.id}/study-session/${studySession.id}`}>
            <button>
              {studySession.id}
            </button>
          </Link>
        ))}
      </main>
    </div>
  );
}