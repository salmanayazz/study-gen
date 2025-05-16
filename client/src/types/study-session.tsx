import StudyQuestion from './study-question';

export default interface StudySession {
    id: number;
    duration: number;
    files: string[];
    page_start: number;
    page_end: number;
    study_questions: StudyQuestion[];
}