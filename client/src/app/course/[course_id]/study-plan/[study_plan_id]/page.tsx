import type { StudyPlan } from "@/types/study-plan";
import StudySessionList from "./StudySessionList";

async function fetchStudyPlan(course_id: string, study_plan_id: string): Promise<StudyPlan | undefined> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/course/${course_id}/study-plan`);
    if (!res.ok) return undefined;

    return (await res.json()).find((studyPlan: StudyPlan) => studyPlan.id === Number(study_plan_id));
  } catch {
    return undefined;
  }
}

export default async function StudyPlanPage({ params }: { params: Promise<{ course_id: string, study_plan_id: string }> }) {
  const { course_id, study_plan_id } = await params;
  const studyPlan = await fetchStudyPlan(course_id, study_plan_id);

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "NULL";
    if (typeof date === "string") {
      date = new Date(date);
    }

    date.setDate(date.getDate());

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      
      <h1 className="text-3xl font-bold">
        Study Plan
      </h1>
      <h2 className="text-2xl font-semibold text-muted-foreground">
        {formatDate(studyPlan?.date)}
      </h2>
      <div className="border-b" />
      
      <StudySessionList
        course_id={course_id}
        studyPlan={studyPlan as StudyPlan}
        formatDate={formatDate}
      />
      
    </div>
  );
}
