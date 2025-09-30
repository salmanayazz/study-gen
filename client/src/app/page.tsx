import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black text-center px-4 text-gray-100">
      {/* hero */}
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        StudyGen 📚
      </h1>
      <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-8">
        An AI-powered study planner that generates smart questions, 
        creates study sessions, and helps you study more efficiently.
      </p>

      {/* CTA button*/}
      <Link href="/course">
        <Button
          variant="outline"
          size="lg"
          className="px-8 py-6 text-lg border-gray-500 text-gray-100 hover:bg-gray-800 shadow-md hover:shadow-lg transition"
        >
          Get Started →
        </Button>
      </Link>

      {/* features */}
      <div className="mt-16 grid gap-6 md:grid-cols-3 w-full max-w-4xl">
        <div className="p-6 bg-gray-800 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="font-semibold text-lg mb-2">📖 Smart Study Sessions</h3>
          <p className="text-gray-400 text-sm">
            Break down PDFs and notes into structured sessions that fit your schedule.
          </p>
        </div>
        <div className="p-6 bg-gray-800 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="font-semibold text-lg mb-2">🤖 AI-Generated Questions</h3>
          <p className="text-gray-400 text-sm">
            Automatically generate quizzes and practice questions to test your knowledge.
          </p>
        </div>
        <div className="p-6 bg-gray-800 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="font-semibold text-lg mb-2">📊 Track Progress</h3>
          <p className="text-gray-400 text-sm">
            Visualize your learning journey and stay on top of your study goals.
          </p>
        </div>
      </div>

      <footer className="mt-16 text-gray-500 text-sm">
        Built with ❤️ using Next.js & FastAPI
      </footer>
    </main>
  );
}
