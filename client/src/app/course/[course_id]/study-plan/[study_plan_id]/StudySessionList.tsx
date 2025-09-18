import type { StudyPlan } from "@/types/study-plan";
import type { StudySession } from "@/types/study-session";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { File } from "@/types/file";

interface StudySessionListProps {
  course_id: string;
  studyPlan: StudyPlan;
  formatDate: (date: Date | string | undefined) => string;
}

export default function StudySessionList({
  course_id,
  studyPlan,
  formatDate
}: StudySessionListProps) {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {studyPlan?.study_sessions.map((studySession: StudySession) => (
        <Link
          key={studySession.id}
          href={`/course/${course_id}/study-plan/${studyPlan.id}/study-session/${studySession.id}`}
        >
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-2">
              {formatDate(studySession?.date)}
            </h2>

            <div className="text-sm text-muted-foreground space-y-1">
              {studySession.files.map((file: File, index: number) => (
                <div key={file.id}>
                  <span className="font-medium">{file.name}</span>
                  
                  <span className="text-xs text-muted-foreground ml-2">
                    {/* show page range for each file, for each session */}
                    {studySession.files.length === 1
                      ? `${studySession.page_end - studySession.page_start + 1} pages`
                      : index === 0
                        ? `${file.page_count - studySession.page_start + 1} pages`
                        : index === studySession.files.length - 1
                          ? `${studySession.page_end + 1} pages`
                          : `${file.page_count} pages`
                    }
                  </span>
                </div>
              ))}
            </div>

          </Card>
          
        </Link>
      ))}
    </div>
  )
}