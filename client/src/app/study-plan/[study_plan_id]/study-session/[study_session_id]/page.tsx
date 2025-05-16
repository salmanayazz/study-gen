"use client";

import StudySession from "@/types/study-session";
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import { useStudyPlan } from "@/contexts/study-plan-context";

export default function StudySessionPage() {
    const router = useRouter();
    const { study_plan_id, study_session_id } = useParams();
    const { getStudySession } = useStudyPlan();

    const [studySession, setStudySession] = useState<StudySession | null>(null);

    useEffect(() => {
        const fetchStudySession = async () => {
            setStudySession(await getStudySession(Number(study_plan_id), Number(study_session_id)));
        };
        fetchStudySession();
    }, []);


    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <header className="row-start-1 text-center">
                <h1 className="text-4xl font-bold">
                    Study Session {studySession?.id}
                </h1>
            </header>
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                {studySession?.study_questions.map((studyQuestion) => (
                    <div key={studyQuestion.id} onClick={() => router.push(`/study-plan/${study_plan_id}/study-session/${study_session_id}/study-question/${studyQuestion.id}`)}>
                        {studyQuestion.question}
                    </div>
                ))}
            </main>
        </div>
    );
}