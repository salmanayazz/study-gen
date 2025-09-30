import FileManagement from "./FileManagement";

export default async function FilePage({
  params,
}: {
  params: Promise<{ course_id: string }>;
}) {
  const { course_id } = await params;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 border-b pb-4">Manage Files</h1>
      <FileManagement course_id={Number(course_id)} />
    </div>
  );
}