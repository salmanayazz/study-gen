"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AIChatWindow({ course_id }: { course_id: string }) {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!question.trim()) return;
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/course/${course_id}/question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question }),
      });

      if (res.ok) {
        const data = await res.json();
        setResponse(data.answer || "No response from AI.");
      } else {
        setResponse("Error: Failed to get AI response.");
      }
    } catch (err) {
      console.error(err);
      setResponse("Error: Could not reach AI service.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Input
          placeholder="Ask AI..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Thinking..." : "Ask"}
        </Button>
      </div>

      {response && (
        <div className="p-3 rounded bg-muted text-sm whitespace-pre-wrap">
          {response}
        </div>
      )}
    </div>
  );
}
