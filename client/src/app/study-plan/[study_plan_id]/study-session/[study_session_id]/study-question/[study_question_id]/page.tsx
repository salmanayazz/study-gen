"use client";

import { useParams } from "next/navigation";
import { useStudyPlan } from "@/contexts/study-plan-context";
import { useEffect, useState } from "react";
import StudyQuestion from "@/types/study-question";



export default function StudyQuestionPage() {
    const { study_plan_id, study_session_id, study_question_id } = useParams();
    const { getStudyQuestion, answerStudyQuestion } = useStudyPlan();

    const [studyQuestion, setStudyQuestion] = useState<StudyQuestion | null>();
    const [userAnswer, setUserAnswer] = useState<string>("")

    useEffect(() => {
        const fetchQuestion = async () => {
            setStudyQuestion(await getStudyQuestion(Number(study_plan_id), Number(study_session_id), Number(study_question_id)));
        }
        fetchQuestion();
    }, [])

    useEffect(() => {
        console.log(studyQuestion)
    }, [studyQuestion])

    const onClick = async (option: string) => {
        const result = await answerStudyQuestion(Number(study_plan_id), Number(study_session_id), Number(study_question_id), option)

        if (studyQuestion) {
            const copy: StudyQuestion = {...studyQuestion};
            copy.user_answer = option;
            copy.correct =  result ? true : false;
            setStudyQuestion(copy)
        }

    } 

    return (
        <div className="flex flex-col">
            <h2>
                {studyQuestion?.question}
            </h2>

            {!studyQuestion?.options || studyQuestion?.options.length == 0 ? (
                <>
                    <textarea onChange={(e) => setUserAnswer(e.target.value)}/>
                    <button onClick={() => onClick(userAnswer)} className={studyQuestion && studyQuestion.correct ? (studyQuestion?.correct ? "bg-green-600" : "bg-red-600") : ""}>
                        Submit
                    </button>
                </>
            ) : (
                studyQuestion?.options.map((option) => (
                    <button key={option} onClick={() => onClick(option)} className={studyQuestion.user_answer == option ? (studyQuestion.correct ? "bg-green-600" : "bg-red-600") : ""}>
                        <h3 >
                            {option}
                        </h3>
                    </button>
                ))
            )}

            
        </div>
    );
}