import type { StudyPlan } from "@/types/study-plan";
import Link from 'next/link'

async function fetchStudyPlans(course_id: string): Promise<StudyPlan[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/course/${course_id}/study-plan`);
  return res.ok ? res.json() : [];
}

export default async function Course({ params }: { params: Promise<{ course_id: string }> }) {
  const { course_id } = await params;
  const studyPlans = await fetchStudyPlans(course_id);
  
  return (
    <div>
      <main>
        <Link href={course_id + "/file"}>
          <button>See Files</button>
        </Link>

        <Link href={course_id + "/study-plan/create"}>
          <button>Create Study Plan</button>
        </Link>

        {studyPlans.map((studyPlan: StudyPlan) => (
          <Link key={studyPlan.id} href={`${course_id}/study-plan/${studyPlan.id}`}>
            <h2 className="text-2xl font-bold">{studyPlan.id}</h2>
          </Link>
        ))}
      </main>
    </div>
  );
}
