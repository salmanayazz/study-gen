'use client';

import type { StudyPlan } from "@/types/study-plan";
import type { StudyQuestion } from "@/types/study-question";
import type { StudySession } from "@/types/study-session";
import { useEffect, useState } from "react";
import QuestionCard from "./QuestionCard";
import { useParams } from "next/navigation";

async function fetchStudySession(
  course_id: string,
  study_plan_id: string,
  study_session_id: string
): Promise<StudySession | undefined> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/course/${course_id}/study-plan`
    );

    if (!res.ok) return undefined;

    return (await res.json())
      .find((studyPlan: StudyPlan) => studyPlan.id === Number(study_plan_id))
      .study_sessions.find(
        (studySession: StudySession) =>
          studySession.id === Number(study_session_id)
      );
  } catch (error) {
    console.error("Error fetching study session:", error);
    return undefined;
  }
}

async function answerStudyQuestion(
  course_id: string,
  studyPlanId: string,
  studySessionId: string,
  studyQuestionId: string,
  userAnswer: string
): Promise<boolean | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/course/${course_id}/study-plan/${studyPlanId}/study-session/${studySessionId}/study-question/${studyQuestionId}/user-answer`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_answer: userAnswer }),
      }
    );
    console.log("Submitted answer, server response:");
    console.log(response);

    return (await response.json()).correct;
  } catch (error) {
    console.error("Error submitting answer:", error);
    return null;
  }
}

export default function StudySessionPage() {
  const params = useParams();
  const course_id = params.course_id as string;
  const study_plan_id = params.study_plan_id as string;
  const study_session_id = params.study_session_id as string;

  const [studySession, setStudySession] = useState<StudySession | undefined>(undefined);
  const [questions, setQuestions] = useState<StudyQuestion[]>([]);

  useEffect(() => {
    console.log(questions);
  }, [questions]);

  useEffect(() => {
    const load = async () => {
      const session = await fetchStudySession(
        course_id,
        study_plan_id,
        study_session_id
      );
      setStudySession(session);
      setQuestions(session?.study_questions || []);
    };
    load();
  }, [course_id, study_plan_id, study_session_id]);

  async function handleAnswer(
    studyQuestionId: number,
    userAnswer: string
  ): Promise<void> {
    await answerStudyQuestion(
      course_id,
      study_plan_id,
      study_session_id,
      studyQuestionId.toString(),
      userAnswer
    );

    // re-fetch session so we get updated user_answer + correct flags
    const session = await fetchStudySession(
      course_id,
      study_plan_id,
      study_session_id
    );
    setQuestions(session?.study_questions || []);
  }

  function formatDate(date: Date | string | undefined) {
    if (!date) return "NULL";
    if (typeof date === "string") date = new Date(date);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Study Session</h1>
      <h2 className="text-2xl font-semibold text-muted-foreground">
        {formatDate(studySession?.date)}
      </h2>
      <div className="border-b" />

      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-3">
        {questions.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            handleAnswer={handleAnswer}
          />
        ))}

        {questions.length === 0 && (
          <p className="text-muted-foreground">No questions available.</p>
        )}
      </div>
    </div>
  );
}
