'use client';

import type { StudyQuestion } from "@/types/study-question";
import { useState } from "react";
import { answerStudyQuestion, fetchStudyQuestion } from "./page";

interface StudyQuestionFormProps {
    courseId: string
    studyPlanId: string
    studySessionId: string
    studyQuestionId: string
    studyQuestion?: StudyQuestion
}

export default function StudyQuestionForm({ courseId, studyPlanId, studySessionId, studyQuestionId, studyQuestion }: StudyQuestionFormProps) {
    const [userAnswer, setUserAnswer] = useState("");
    const [studyQuestionState, setStudyQuestionState] = useState<StudyQuestion | undefined>(studyQuestion);

    const onClick = async (option: string) => {
        await answerStudyQuestion(courseId, studyPlanId, studySessionId, studyQuestionId, option);
        setStudyQuestionState(await fetchStudyQuestion(courseId, studyPlanId, studySessionId, studyQuestionId));
    }

    return (
        <>
        {!studyQuestionState?.options || studyQuestionState?.options.length == 0 ? (
            <>
                <textarea onChange={(e) => setUserAnswer(e.target.value)}/>
                <button  
                    onClick={() => onClick(userAnswer)} 
                    className={studyQuestionState && studyQuestionState.correct != null ? (studyQuestionState.correct ? "bg-green-600" : "bg-red-600") : ""}
                >
                    Submit
                </button>
            </>
        ) : (
            studyQuestionState?.options.map((option) => (
                <button 
                    key={option} 
                    onClick={() => onClick(option)} 
                    className={studyQuestionState.user_answer == option ? (studyQuestionState.correct ? "bg-green-600" : "bg-red-600") : ""}
                >
                    <h3 >
                        {option}
                    </h3>
                </button>
            ))
        )}
        </>
    )
}