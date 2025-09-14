import type { File as FileModel } from "@/types/file";
import FileManagement from "./FileManagement";

export async function fetchFiles(course_id: number): Promise<FileModel[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/course/${course_id}/file`
  );
  return res.ok ? res.json() : [];
}

export async function uploadFile(
  course_id: number,
  name: string,
  path: string,
  fileData: File
): Promise<void> {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("path", path);
  formData.append("file_data", fileData);

  await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/course/${course_id}/file`,
    {
      method: "POST",
      body: formData,
    }
  );
}

export async function deleteFile(
  course_id: number,
  fileId: number
): Promise<void> {
  await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/course/${course_id}/file/${fileId}`,
    {
      method: "DELETE",
    }
  );
}

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