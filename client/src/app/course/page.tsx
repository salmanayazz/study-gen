import type { Course } from "@/types/course";
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";

async function fetchCourses(): Promise<Course[] | undefined> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/course`);

  if (!res.ok) {
    return undefined;
  }
  
  return res.json();
}

export default async function Courses() {
  const courses = await fetchCourses();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Courses</h1>
      <Link href="/course/new">
        <Button variant="outline" className="mb-6">
          <FiPlus /> New Course
        </Button>
      </Link>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course: Course) => (
          <Link key={course.id} href={`/course/${course.id}`}>
            <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <CardHeader>
                <CardTitle className="text-xl font-bold">{course.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Files: <span className="font-medium">{course.files?.length ?? 0}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Study Plans:{" "}
                  <span className="font-medium">{course.study_plans?.length ?? 0}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
