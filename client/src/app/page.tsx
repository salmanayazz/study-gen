import StudyPlan from "../types/study-plan";
import Link from 'next/link'

async function fetchStudyPlans(): Promise<StudyPlan[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/study-plan`);
  return res.json();
}

export default async function Home() {
  const studyPlans = await fetchStudyPlans();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Link href="file">
          <button>See Files</button>
        </Link>
        {studyPlans.map((studyPlan: StudyPlan) => (
          <Link key={studyPlan.id} href={`/study-plan/${studyPlan.id}`}>
            <h2 className="text-2xl font-bold">{studyPlan.id}</h2>
          </Link>
        ))}
      </main>
    </div>
  );
}
