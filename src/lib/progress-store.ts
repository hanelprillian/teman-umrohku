import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SessionId } from "@/content/types";

export interface SessionProgress {
  stepIndex: number;
  counts: Record<string, number>;
  completed: boolean;
}

interface ProgressState {
  sessions: Partial<Record<SessionId, SessionProgress>>;
  lastSessionId?: SessionId;
  setStep: (sessionId: SessionId, stepIndex: number) => void;
  setCount: (sessionId: SessionId, stepId: string, count: number) => void;
  completeSession: (sessionId: SessionId) => void;
  resetSession: (sessionId: SessionId) => void;
  resetAll: () => void;
}

const emptyProgress: SessionProgress = {
  stepIndex: 0,
  counts: {},
  completed: false,
};

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      sessions: {},
      setStep: (sessionId, stepIndex) =>
        set((state) => ({
          lastSessionId: sessionId,
          sessions: {
            ...state.sessions,
            [sessionId]: {
              ...(state.sessions[sessionId] ?? emptyProgress),
              stepIndex,
            },
          },
        })),
      setCount: (sessionId, stepId, count) =>
        set((state) => {
          const current = state.sessions[sessionId] ?? emptyProgress;
          return {
            lastSessionId: sessionId,
            sessions: {
              ...state.sessions,
              [sessionId]: {
                ...current,
                counts: { ...current.counts, [stepId]: count },
              },
            },
          };
        }),
      completeSession: (sessionId) =>
        set((state) => ({
          lastSessionId: sessionId,
          sessions: {
            ...state.sessions,
            [sessionId]: {
              ...(state.sessions[sessionId] ?? emptyProgress),
              completed: true,
            },
          },
        })),
      resetSession: (sessionId) =>
        set((state) => ({
          sessions: { ...state.sessions, [sessionId]: emptyProgress },
        })),
      resetAll: () => set({ sessions: {}, lastSessionId: undefined }),
    }),
    { name: "pu-progress" },
  ),
);
