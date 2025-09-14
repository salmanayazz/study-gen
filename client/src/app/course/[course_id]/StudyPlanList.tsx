"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StudyPlan } from "@/types/study-plan";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiTrash } from "react-icons/fi";

interface StudyPlanListProps {
  fetchStudyPlans: (course_id: string) => Promise<StudyPlan[]>;
  deleteStudyPlan?: (study_plan_id: number) => Promise<void>;
  course_id: string;
}

export default function StudyPlanList({
  fetchStudyPlans,
  deleteStudyPlan,
  course_id
}: StudyPlanListProps) {

  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);

  useEffect(() => {
    fetchStudyPlans(course_id).then(setStudyPlans);
  }, [fetchStudyPlans, course_id]);

  function formatDate(date?: Date | string): string {
    if (typeof date === "string") {
      date = new Date(date);
    }

    return date?.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }) ?? "NULL";
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {studyPlans.map((studyPlan: StudyPlan) => (
        <Link
          key={studyPlan.id}
          href={`/course/${course_id}/study-plan/${studyPlan.id}`}
        >
          <Card className="hover:shadow-md transition">
            <CardHeader
              className="flex flex-row justify-between items-center"
            >
              <CardTitle>{formatDate(studyPlan.date)}</CardTitle>
              <Button 
                variant="secondary"
                size="icon"
                onClick={async (e) => {
                  e.preventDefault();
                  if (!deleteStudyPlan) return;
                  await deleteStudyPlan(studyPlan.id);
                  fetchStudyPlans(course_id).then(setStudyPlans);
                }}
              >
                <FiTrash />  
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Sessions: <span className="font-medium">{studyPlan.study_sessions?.length ?? 0}</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}