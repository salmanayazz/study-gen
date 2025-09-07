import type { File } from './file'
import type { StudyPlan } from './study-plan'

export interface Course {
    id: number;
    name: string;
    files?: File[]
    study_plans?: StudyPlan[]
}