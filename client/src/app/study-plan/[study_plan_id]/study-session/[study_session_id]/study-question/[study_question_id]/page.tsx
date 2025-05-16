"use client";

import { useParams } from "next/navigation";
import { useStudyPlan } from "@/contexts/study-plan-context";
import { useEffect, useState } from "react";
import StudyQuestion from "@/types/study-question";



export default function StudyQuestionPage() {
    const { study_plan_id, study_session_id, study_question_id } = useParams();
    const { getStudyQuestion } = useStudyPlan();

    const [studyQuestion, setStudyQuestion] = useState<StudyQuestion | null>();

    useEffect(() => {
        const fetchQuestion = async () => {
            setStudyQuestion(await getStudyQuestion(Number(study_plan_id), Number(study_session_id), Number(study_question_id)));
        }
        fetchQuestion();
    }, [])

    return (
        <div>
            <h2>
                {studyQuestion?.question}
            </h2>

            {studyQuestion?.options.length == 0 ? (
                <textarea/>
            ) : (
                <div>
                    {studyQuestion?.options.map((option) => (
                        <h3 key={option}>
                            {option}
                        </h3>
                    ))}
                </div>
            )}
        </div>
    );
}