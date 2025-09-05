import type { File } from './file'

export interface Course {
    id: number;
    name: string;
    files: File[]
}