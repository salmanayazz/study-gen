import StudySession from './study-session';

export default interface StudyPlan {
    id: number;
    date: Date;
    study_sessions: StudySession[];
}