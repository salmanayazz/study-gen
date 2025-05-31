import FileModel from "@/types/file";
import FileManagement from "./FileManagement";

export async function fetchFiles(): Promise<FileModel[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/file`);
  return res.json();
}

export async function uploadFile(name: string, path: string, fileData: File): Promise<void> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('path', path);
    formData.append('file_data', fileData);

    await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/file`, {
        method: "POST",
        body: formData,
    });
}

export async function deleteFile(fileId: number): Promise<void> {
    await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/file/${fileId}`, { 
        method: "DELETE"
    });
}

export default async function FilePage() {

    return (
        <div>
            <FileManagement files={await fetchFiles()} />
        </div>
    )
}