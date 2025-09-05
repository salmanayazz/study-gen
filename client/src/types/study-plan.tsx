import type { StudySession } from './study-session';

export interface StudyPlan {
    id: number;
    date: Date;
    study_sessions: StudySession[];
}