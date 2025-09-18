import type { StudyQuestion } from './study-question';
import type { File } from './file';

export interface StudySession {
    id: number;
    date: Date;
    duration: number;
    files: File[];
    page_start: number;
    page_end: number;
    study_questions: StudyQuestion[];
}