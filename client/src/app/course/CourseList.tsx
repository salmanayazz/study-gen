"use client";

import { useEffect, useState } from "react";
import type { Course } from "@/types/course";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FiTrash } from "react-icons/fi";

interface CourseListProps {
  fetchCourses: () => Promise<Course[] | undefined>;
  deleteCourse: (course_id: number) => Promise<void>;
}

export default function CourseList({
  fetchCourses,
  deleteCourse
}: CourseListProps) {

  const [courses, setCourses] = useState<Course[] | undefined>([]);

  useEffect(() => {
    fetchCourses().then(setCourses);
  }, [fetchCourses]);


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses?.map((course: Course) => (
        <Link key={course.id} href={`/course/${course.id}`}>
          <Card className="cursor-pointer">
            <CardHeader
              className="flex flex-row justify-between items-center"
            >
              <CardTitle className="text-xl font-bold">{course.name}</CardTitle>

              <Button 
                variant="secondary"
                size="icon"
                className=""
                onClick={async (e) => {
                  e.preventDefault();
                  await deleteCourse(course.id);
                  fetchCourses().then(setCourses);
                }}
              >
                <FiTrash />  
              </Button>
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
  );
}