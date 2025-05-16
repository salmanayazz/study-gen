'use client';

import StudyPlan from "@/types/study-plan";
import StudySession from "@/types/study-session";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import { useStudyPlan } from "@/contexts/study-plan-context";
import { useParams } from "next/navigation";

export default function StudyPlanPage() {
    const router = useRouter();
    const { study_plan_id } = useParams();
    const { getStudyPlan } = useStudyPlan();

    const [studyPlan, setStudyPlan] = useState<StudyPlan | null>();

    useEffect(() => {
        const fetchStudyPlan = async () => {
            setStudyPlan(await getStudyPlan(Number(study_plan_id)));
        };
        fetchStudyPlan();
    }, [])

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <header className="row-start-1 text-center">
                <h1 className="text-4xl font-bold">
                    Study Plan {studyPlan?.id}
                </h1>
            </header>
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                {studyPlan?.study_sessions.map((studySession: StudySession) => (
                    <button key={studySession.id} onClick={() => router.push(`/study-plan/${studyPlan.id}/study-session/${studySession.id}`)}>
                        {studySession.id}
                    </button>
                ))}
            </main>
        </div>
    );
}