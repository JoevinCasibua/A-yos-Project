import { create } from 'zustand';

export interface DraftState {
  categoryId: string | null;
  address: string;
  description: string;
  cameraPhoto: string | null;
  voiceRecord: string | null;
  schedule: string;
  budget: string;
  notes: string;
}

export interface SavedDraft extends DraftState {
  id: string;
  category: string;
  issue: string;
  date: string;
  time: string;
  iconName: string;
  color: string;
  bg: string;
}

const INITIAL_DRAFT_STATE: DraftState = {
  categoryId: null,
  address: '123 Main St, Makati City',
  description: '',
  cameraPhoto: null,
  voiceRecord: null,
  schedule: '',
  budget: '',
  notes: '',
};

const MOCK_SAVED_DRAFTS: SavedDraft[] = [
  {
    id: '1',
    category: 'Plumbing',
    issue: 'Leaking P-trap under the kitchen sink',
    date: 'Oct 12, 2026',
    time: '14:30',
    iconName: 'Droplets',
    color: '#0ea5e9',
    bg: '#e0f2fe',
    categoryId: '1',
    address: '123 Main St, Makati City',
    description: 'Leaking P-trap under the kitchen sink',
    cameraPhoto: null,
    voiceRecord: null,
    schedule: 'Tomorrow morning',
    budget: '1500',
    notes: 'Please bring your own tools.',
  },
  {
    id: '2',
    category: 'Electrical',
    issue: 'Flickering lights in the living room',
    date: 'Oct 10, 2026',
    time: '09:15',
    iconName: 'Zap',
    color: '#f59e0b',
    bg: '#fef3c7',
    categoryId: '2',
    address: '123 Main St, Makati City',
    description: 'Flickering lights in the living room',
    cameraPhoto: null,
    voiceRecord: null,
    schedule: 'Anytime this week',
    budget: '500',
    notes: '',
  },
];

interface DraftStore {
  currentDraft: DraftState;
  savedDrafts: SavedDraft[];
  updateCurrentDraft: (updates: Partial<DraftState>) => void;
  clearCurrentDraft: () => void;
  saveDraft: (categoryInfo: { category: string, iconName: string, color: string, bg: string }) => void;
  loadDraft: (id: string) => void;
  deleteDraft: (id: string) => void;
}

export const useDraftStore = create<DraftStore>((set, get) => ({
  currentDraft: INITIAL_DRAFT_STATE,
  savedDrafts: MOCK_SAVED_DRAFTS,
  
  updateCurrentDraft: (updates) => set((state) => ({
    currentDraft: { ...state.currentDraft, ...updates }
  })),

  clearCurrentDraft: () => set({ currentDraft: INITIAL_DRAFT_STATE }),

  saveDraft: (categoryInfo) => set((state) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    const newDraft: SavedDraft = {
      id: Date.now().toString(),
      ...state.currentDraft,
      issue: state.currentDraft.description || 'Draft Request',
      date: dateStr,
      time: timeStr,
      ...categoryInfo
    };

    return { 
      savedDrafts: [newDraft, ...state.savedDrafts],
      currentDraft: INITIAL_DRAFT_STATE // clear after saving
    };
  }),

  loadDraft: (id) => set((state) => {
    const draftToLoad = state.savedDrafts.find(d => d.id === id);
    if (draftToLoad) {
      const { id: _id, category, issue, date, time, iconName, color, bg, ...draftState } = draftToLoad;
      return { currentDraft: draftState };
    }
    return state;
  }),

  deleteDraft: (id) => set((state) => ({
    savedDrafts: state.savedDrafts.filter(d => d.id !== id)
  }))
}));
