"use client";

import { fetchFiles } from "@/app/course/[course_id]/file/page";
import type { File } from "@/types/file";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

async function createStudyPlan(course_id: number, date: Date, timeAllocated: number[], files: number[]) {
  await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/course/${course_id}/study-plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      date: date,
      time_allocated: timeAllocated,
      files: files
    })
  });
}

export default function Create() {
  const params = useParams();
  const course_id = Number(params.course_id);

  const [files, setFiles] = useState<File[]>();
  const [includedFiles, setIncludedFiles] = useState<number[]>([]);
  const [examDate, setExamDate] = useState<Date>();
  const [timeAllocated, setTimeAllocated] = useState<number[]>([]);

  useEffect(() => {
    const handleFetchFiles = async () => setFiles(await fetchFiles(course_id));
    handleFetchFiles();
  }, []);

  useEffect(() => {
    if (!examDate) return;

    const diffDays = Math.abs((examDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    setTimeAllocated(Array(Math.ceil(diffDays) + 2).fill(0));
  }, [examDate]);

  const handleInclude = (fileId: number) => setIncludedFiles([...includedFiles, fileId]);
  const handleRemove = (fileIdToRemove: number) => setIncludedFiles(includedFiles.filter((id) => id !== fileIdToRemove));
  const handleSetTimeAllocated = (index: number, value: number) => {
    if (value < 0 || value > 24) return;
    setTimeAllocated((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };
  const handleCreateStudyPlan = () => { 
    if (examDate && files) {
      createStudyPlan(course_id, examDate, timeAllocated, includedFiles); 
    }
  };

  const formatDate = (date: Date | undefined, offset: number) => {
    if (!date) return "NULL";
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + offset);
    return newDate.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <main className="flex flex-col space-y-6 p-4">
      <div>
        <Input type="date" onChange={(e) => setExamDate(new Date(e.target.value))} className="max-w-xs" />
      </div>

      <div className="flex flex-col gap-6">
        {/* time inputs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {timeAllocated.map((time, index) => (
            <Card key={index} className="p-2">
              <CardContent className="flex flex-col gap-2">
                <CardTitle className="text-sm font-medium">{formatDate(examDate, index - timeAllocated.length + 2)}</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Hours:</span>
                  <Input
                    type="number"
                    value={time}
                    onChange={(e) => handleSetTimeAllocated(index, parseInt(e.target.value))}
                    className="w-20"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* files list */}
        <div className="flex flex-col gap-2">
          {files?.map((file) => (
            <Card key={file.id} className="p-2">
              <CardContent className="flex justify-between items-center gap-4">
                <span className="truncate">{file.path + file.name}</span>
                {includedFiles.includes(file.id) ? (
                  <Button variant="destructive" size="sm" onClick={() => handleRemove(file.id)}>
                    Remove
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => handleInclude(file.id)}>
                    Include
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Button onClick={handleCreateStudyPlan} className="self-start">
        Create
      </Button>
    </main>
  );
}
