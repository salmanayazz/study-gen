'use client';

import StudyPlan from "../types/study-plan";
import { useRouter } from 'next/navigation';
import { useStudyPlan } from "@/contexts/study-plan-context";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const { getStudyPlanList, } = useStudyPlan();

  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);

  useEffect(() => {
    const fetchStudyPlans = async () => {
      setStudyPlans(await getStudyPlanList());
    };
    fetchStudyPlans();
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {studyPlans.map((studyPlan: StudyPlan) => (
          <div key={studyPlan.id} onClick={() => router.push(`/study-plan/${studyPlan.id}`)}>  
            <h2 className="text-2xl font-bold">{studyPlan.id}</h2>
          </div>
        ))}
      </main>
    </div>
  );
}
