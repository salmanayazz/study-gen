import type { Course } from "@/types/course";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import CourseList from "./CourseList";

async function fetchCourses(): Promise<Course[] | undefined> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/course`);

  if (!res.ok) {
    return undefined;
  }
  
  return res.json();
}

async function deleteCourse(course_id: number): Promise<void> {
  await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/course/${course_id}`, { method: "DELETE" });
}

export default async function Courses() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Courses</h1>
      <Link href="/course/create">
        <Button variant="outline" className="mb-6">
          <FiPlus /> New Course
        </Button>
      </Link>

      <CourseList
        fetchCourses={async () => {
          "use server";
          return fetchCourses();
        }}
        deleteCourse={async (course_id: number) => {
          "use server";
          return deleteCourse(course_id);
        }}
      />
    </div>
  );
}
