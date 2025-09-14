'use client';

import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";

async function createCourse(name: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/course`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: name
    })
  })

  return res.json();
}

export default function CreateCourse() {
  const router = useRouter();

  return (
    <Dialog open>
      {/* hide the default close button */}
      <DialogContent className="[&>button:last-child]:hidden backdrop:blur">
        <DialogHeader>
          <DialogTitle>Create Course</DialogTitle>
          {/* add custom close button that navigates to prev page */}
          <DialogClose asChild>
            <button
              type="button"
              onClick={() => router.back()}
              className="absolute right-4 top-4"
            >
              ✕
            </button>
          </DialogClose>

          <form
            action={async (formData: FormData) => {
              const name = formData.get("name") as string;
              await createCourse(name);
              router.back();
              window.location.reload();
            }}
            className="flex flex-col gap-4 mt-5"
          >
            <Input type="text" name="name" placeholder="Course Name" required />
            <Button 
              type="submit"
              className="self-end"
            >
              Create
            </Button>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
