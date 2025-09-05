"use client";

import { useEffect, useState } from "react";
import { deleteFile, uploadFile, fetchFiles } from "./page";
import type { File } from "@/types/file";

interface FileManagementProps {
    course_id: number
}

export default function FileManagement({
    course_id,
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

        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        const file = fileInput.files?.[0];

        const filePath = document.getElementById('filePath') as HTMLInputElement;


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
        deleteFile(course_id, fileId)
        setFilesState(await fetchFiles(course_id));
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