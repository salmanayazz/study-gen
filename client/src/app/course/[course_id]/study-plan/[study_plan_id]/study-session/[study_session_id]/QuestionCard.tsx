import type { StudyQuestion } from "@/types/study-question";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

interface QuestionCardProps {
  question: StudyQuestion
  handleAnswer: (questionId: number, userAnswer: string) => void
}

export default function QuestionCard({
  question,
  handleAnswer
}: QuestionCardProps) {
  useEffect(() => {
    if (question.correct == true) {
      console.log("Correct answer!");
      console.log(question)
    }
  }, [question.correct, question]);
  return (
    <Card key={question.id}>
      <CardHeader>
        <CardTitle>{question.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!question.options || question.options.length === 0 ? (
          <div className="flex flex-col gap-2">
            <Textarea
              defaultValue={question.user_answer || ""}
              onChange={(e) => (question.user_answer = e.target.value)}
            />
            <Button
              onClick={() => handleAnswer(question.id, question.user_answer || "")}
              className={
                question.correct != null
                  ? question.correct
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                  : ""
              }
            >
              Submit
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {question.options.map((option) => (
              <Button
                key={option}
                variant="default"
                onClick={() => handleAnswer(question.id, option)}
                className={`h-auto whitespace-normal break-words ${
                  question.user_answer === option
                    ? question.correct
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-red-600 text-white hover:bg-red-700"
                    : ""

                }`}
              >
                {option}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}