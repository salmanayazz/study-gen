"use client";

import { fetchFiles } from "@/app/file/page";
import File from "@/types/file";
import { useEffect, useState } from "react";

async function createStudyPlan(date: Date, timeAllocated: number[], files: File[]) {
    console.log(files.map((file) => { return file.id }))
    await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/study-plan`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            date: date,
            time_allocated: timeAllocated,
            files: files.map((file) => { return file.id })
        })
    });
}


export default function Create() {
    const [files, setFiles] = useState<File[]>();
    const [includedFiles, setIncludedFiles] = useState<number[]>([]);
    const [examDate, setExamDate] = useState<Date>();
    const [timeAllocated, setTimeAllocated] = useState<number[]>([]);

    useEffect(() => {
        const handleFetchFiles = async () => {
            setFiles(await fetchFiles());
        }
        handleFetchFiles();
    }, [])

    useEffect(() => {
        if (!examDate) return;
    
        const test = new Date();
        const diffDays = Math.abs((examDate.getTime() - test.getTime()) / (1000 * 60 * 60 * 24))
        const newTimeAllocated = [];
        for (let i = 0; i <= diffDays; i++) {
            newTimeAllocated.push(0);
        }
        setTimeAllocated(newTimeAllocated);
    }, [examDate])
    

    const handleInclude = (fileId: number) => {
        const includedFilesCopy = [...includedFiles];
        includedFilesCopy.push(fileId);
        setIncludedFiles(includedFilesCopy);
        setFiles(files)
    }

    const handleRemove = (fileIdToRemove: number) => {
        const includedFilesCopy = [...includedFiles];
        setIncludedFiles(includedFilesCopy.filter((id) => id != fileIdToRemove));
        setFiles(files)
    }

    const handleSetTimeAllocated = (index: number, value: number) => {
        if (value < 0 || value > 24) {
            return;
        }
        
        setTimeAllocated(prevTimeAllocated => {
            const timeAllocatedCopy = [...prevTimeAllocated];
            timeAllocatedCopy[index] = value;
            return timeAllocatedCopy;
        });
    }

    const handleCreateStudyPlan = () => {
        if (!examDate || !files) {
            return;
        }
        createStudyPlan(examDate, timeAllocated, files)
    }

    return (
        <main className="flex flex-col">
            <div>
                <input type="date" onChange={(e) => setExamDate(new Date(e.target.value))} />
            </div>

            <div className="flex">
                <div className="flex flex-col">
                   {timeAllocated.map((time, index) => (
                        <div key={index}>
                            <h2>Day {index + 1}:</h2>
                            <input type="number" value={time} onChange={(e) => handleSetTimeAllocated(index, parseInt(e.target.value))} />
                        </div>
                   ))}
                </div>

                <div className="flex flex-col">
                    {files?.map((file) => (
                        <div key={file.id} className="flex gap-4">
                            <h2>{file.path + file.name}</h2>

                            {includedFiles.find((id) => id == file.id) ? (
                                <button onClick={() => handleRemove(file.id)}>Remove</button>
                            ) : (
                                <button onClick={() => handleInclude(file.id)}>Include</button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <button onClick={handleCreateStudyPlan}>
                Create
            </button>
        </main>
    );
}