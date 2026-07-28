import React, { createContext, useContext, useState } from 'react';
import { UrgencyLevel, RequestState } from '@/types/request';

export type { UrgencyLevel, RequestState, RequestStatus } from '@/types/request';

const initialState: RequestState = {
  photos: [],
  description: '',
  category: '',
  aiSummary: '',
  aiRecommendations: [],
  confidenceScore: 0,
  hasParts: null,
  partsDescription: '',
  urgency: null,
  location: null,
  selectedWorkerId: null,
  status: 'Draft',
};

type RequestContextType = {
  request: RequestState;
  updateRequest: (updates: Partial<RequestState>) => void;
  resetRequest: () => void;
};

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export const RequestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [request, setRequest] = useState<RequestState>(initialState);

  const updateRequest = (updates: Partial<RequestState>) => {
    setRequest((prev) => ({ ...prev, ...updates }));
  };

  const resetRequest = () => {
    setRequest(initialState);
  };

  return (
    <RequestContext.Provider value={{ request, updateRequest, resetRequest }}>
      {children}
    </RequestContext.Provider>
  );
};

export const useRequest = () => {
  const context = useContext(RequestContext);
  if (context === undefined) {
    throw new Error('useRequest must be used within a RequestProvider');
  }
  return context;
};
