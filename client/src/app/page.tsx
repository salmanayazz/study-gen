import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {

  return (
    <Link href="/course" className="flex min-h-screen flex-col items-center justify-center">
      <Button variant="outline" className="mt-10">
        Go to Courses
      </Button>
    </Link>
  );
}
