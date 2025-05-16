'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import StudyPlan  from '@/types/study-plan';
import StudySession from '@/types/study-session';
import StudyQuestion from '@/types/study-question';

type ContextType = {
  getStudyPlanList: () => Promise<StudyPlan[]>;
  getStudyPlan: (studyPlanId: number) => Promise<StudyPlan | null>;
  getStudySession: (studyPlanId: number, studySessionId: number) => Promise<StudySession | null>;
  getStudyQuestion: (studyPlanId: number, studySessionId: number, studyQuestionId: number) => Promise<StudyQuestion | null>;
};

const StudyPlanContext = createContext<ContextType | undefined>(undefined);

export function StudyPlanProvider({ children }: { children: ReactNode }) {
  const [studyPlanList, setStudyPlanList] = useState<StudyPlan[] | null>(null);

    const getStudyPlanList = async (): Promise<StudyPlan[]> => {
      if (studyPlanList) {
        return studyPlanList;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/study-plan`);
      const data = await response.json();
      console.log("response data")
      console.log(data)
      setStudyPlanList(data);
      return data;
    }

    const getStudyPlan = async (studyPlanId: number): Promise<StudyPlan | null> => {
      return (await getStudyPlanList())?.find((studyPlan) => studyPlan.id === studyPlanId) || null;
    };

    const getStudySession = async (studyPlanId: number, studySessionId: number): Promise<StudySession | null> => {
      return (await getStudyPlan(studyPlanId))?.study_sessions?.find((studySession) => studySession.id === studySessionId) || null;
    };

    const getStudyQuestion = async (studyPlanId: number, studySessionId: number, studyQuestionId: number): Promise<StudyQuestion | null> => {
      return (await getStudySession(studyPlanId, studySessionId))?.study_questions?.find((studyQuestion) => studyQuestion.id === studyQuestionId) || null;
    };

  return (
    <StudyPlanContext.Provider value={{ 
      getStudyPlanList,
      getStudyPlan,
      getStudySession,
      getStudyQuestion,
    }}>
      {children}
    </StudyPlanContext.Provider>
  );
}

export function useStudyPlan() {
  const context = useContext(StudyPlanContext);
  if (!context) throw new Error('useStudyPlan must be used within StudyPlanProvider');
  return context;
}
