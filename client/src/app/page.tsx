import type { Course } from "@/types/course";
import Link from 'next/link'

async function fetchCourses(): Promise<Course[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/course`);
  return res.json();
}

export default async function Home() {
  const courses = await fetchCourses();

  return (
    <div>
      <main>
        {courses.map((course: Course) => (
          <Link key={course.id} href={`/course/${course.id}`}>
            <h2 className="text-2xl font-bold">{course.id}</h2>
          </Link>
        ))}
      </main>
    </div>
  );
}
