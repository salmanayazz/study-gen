"use client";

import { useState } from "react";
import { deleteFile, uploadFile, fetchFiles } from "./page";
import File from "@/types/file";

interface FileManagementProps {
    files: File[]
}

export default function FileManagement({
    files
}: FileManagementProps) {
    const [filesState, setFilesState] = useState(files);

    const handleFileUpload = async (event: React.FormEvent) => {
        event.preventDefault();

        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        const file = fileInput.files?.[0];

        const filePath = document.getElementById('filePath') as HTMLInputElement;


        if (file && filePath) {
            const name = file.name;
            const path = filePath.value;

            await uploadFile(name, path, file);
            setFilesState(await fetchFiles());
        } else {
            alert("Please select a file.");
        }
    };

    const handleDelete = async (fileId: number) => {
        deleteFile(fileId)
        setFilesState(await fetchFiles());
    }

    return (
        <>
            <form onSubmit={handleFileUpload} className="flex">
                <input type="file" id="fileInput" name="file" />
                <input type="text" id="filePath" name="path" />
                <button type="submit">Upload</button>
            </form>

            {filesState.map((file) => (
                <div key={file.id} className="flex justify-between">
                    <h2>{file.path + file.name}</h2>
                    <button onClick={() => handleDelete(file.id)}>Delete</button>
                </div>
            ))}
        </>
    )
}