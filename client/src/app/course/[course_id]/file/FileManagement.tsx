"use client";

import { useEffect, useState } from "react";
import type { File } from "@/types/file";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { FiTrash } from "react-icons/fi";
import type { File as FileModel } from "@/types/file";

export async function fetchFiles(course_id: number): Promise<FileModel[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/course/${course_id}/file`
  );
  return res.ok ? res.json() : [];
}

async function uploadFile(
  course_id: number,
  name: string,
  path: string,
  fileData: Blob
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

async function deleteFile(
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

interface FileManagementProps {
  course_id: number;
}

export default function FileManagement({
  course_id
}: FileManagementProps) {
  const [filesState, setFilesState] = useState<File[]>([]);

  useEffect(() => {
    async function handleFetchFiles() {
      const files = await fetchFiles(course_id);
      setFilesState(files);
    }
    handleFetchFiles();
  }, [course_id]);

  const handleFileUpload = async (event: React.FormEvent) => {
    event.preventDefault();

    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    const file = fileInput.files?.[0];

    const filePath = document.getElementById("filePath") as HTMLInputElement;

    if (file && filePath) {
      const name = file.name;
      const path = filePath.value;

      await uploadFile(course_id, name, path, file);
      setFilesState(await fetchFiles(course_id));
    } else {
      alert("Please select a file.");
    }
  };

  const handleDelete = async (fileId: number) => {
    await deleteFile(course_id, fileId);
    setFilesState(await fetchFiles(course_id));
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleFileUpload}
        className="flex items-center gap-3"
      >
        <Input type="file" id="fileInput" name="file" className="max-w-xs" />
        <Input
          type="text"
          id="filePath"
          name="path"
          placeholder="Path"
          className="max-w-xs"
        />
        <Button type="submit">Upload</Button>
      </form>
      
      <div className="flex flex-col gap-4">
        {filesState.map((file) => (
          <Card key={file.id}>
            <CardContent className="flex justify-between items-center">
              <span className="truncate font-medium">
                {file.path + file.name}
              </span>

              <Button
                variant="secondary"
                size="icon"
                className="hover:pointer"
                onClick={() => handleDelete(file.id)}
              >
                <FiTrash />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
