'use client';

import type { StudyPlan } from "@/types/study-plan";
import type { StudyQuestion } from "@/types/study-question";
import type { StudySession } from "@/types/study-session";
import { useEffect, useState } from "react";
import QuestionCard from "./QuestionCard";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AIChatWindow from "./AIChatWindow";

// no idea why this component has to be dynamically imported to work
const PDFViewer = dynamic(() => import("./PDFViewer"), { ssr: false });

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
    <div className="container mx-auto p-6 space-y-4 h-screen flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Study Session</h1>
          <h2 className="text-2xl font-semibold text-muted-foreground">{formatDate(studySession?.date)}</h2>
          
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-2">Ask AI</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Ask AI about your notes</DialogTitle>
            </DialogHeader>
            <AIChatWindow course_id={course_id} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-2 rounded shadow-lg">
          {studySession?.files.map((file, index) => (
            <PDFViewer
              key={file.id}
              fileUrl={`${process.env.NEXT_PUBLIC_SERVER_URL}/course/${course_id}/file/${file.id}?page_start=${index === 0 ? studySession.page_start : 1}${index === studySession.files.length - 1 ? `&page_end=${studySession.page_end}` : ''}`}
              fileName={file.name}
            />
          ))}
        </div>

        <div className="flex-1 flex flex-col gap-4 p-2 rounded shadow-lg overflow-y-auto">
          {questions.length ? questions.map((q) => (
            <QuestionCard key={q.id} question={q} handleAnswer={handleAnswer} />
          )) : <p className="text-muted-foreground">No questions available.</p>}
        </div>
      </div>
    </div>
  );
}
