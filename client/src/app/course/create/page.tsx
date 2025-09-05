import { redirect } from 'next/navigation';

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
  return (
    <div>
      <main>
        <h1>Create Course</h1>
        <form action={async (formData: FormData) => {
          "use server";
          const name = formData.get("name") as string;
          await createCourse(name);
          redirect("/");
        }}>
          <input type="text" name="name" placeholder="Course Name" required />
          <button type="submit">Create</button>
        </form>
      </main>
    </div>
  );
}
