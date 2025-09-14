import type { StudyPlan } from "@/types/study-plan";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import StudyPlanList from "./StudyPlanList";
import type { Course } from "@/types/course";

async function fetchCourse(course_id: string): Promise<Course | undefined> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/course/${course_id}`);
  if (!res.ok) {
    return undefined;
  }
  return res.json();
}

async function fetchStudyPlans(course_id: string): Promise<StudyPlan[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/course/${course_id}/study-plan`);
  return res.ok ? res.json() : [];
}

async function deleteStudyPlan(course_id: string, study_plan_id: number): Promise<void> {
  await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/course/${course_id}/study-plan/${study_plan_id}`, {
    method: "DELETE",
  });
}

export default async function Course({ 
  params
 }: { 
  params: Promise<{ course_id: string }> 
}) {
  const { course_id } = await params;
  const course = await fetchCourse(course_id);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold mb-6 border-b pb-4">
        Course: {course?.name}
      </h1>

      <div className="flex gap-4">
        <Link href={`/course/${course_id}/file`}>
          <Button variant="outline">See Files</Button>
        </Link>
        <Link href={`/course/${course_id}/study-plan/create`}>
          <Button>Create Study Plan</Button>
        </Link>
      </div>

      <StudyPlanList
        fetchStudyPlans={async (course_id: string) => {
          "use server";
          return fetchStudyPlans(course_id);
        }}
        deleteStudyPlan={async (study_plan_id: number) => {
          "use server";
          return deleteStudyPlan(course_id, study_plan_id);
        }}
        course_id={course_id}
      />
      
    </div>
  );
}
