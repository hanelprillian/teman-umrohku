import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SessionId } from "@/content/types";

export interface SessionProgress {
  stepIndex: number;
  /** Position within a step in immersive mode: 0 = instructions, n = n-th dua. */
  slideIndex?: number;
  counts: Record<string, number>;
  /** Epoch ms of each counted round, index-aligned with the count. */
  laps?: Record<string, number[]>;
  completed: boolean;
}

interface ProgressState {
  sessions: Partial<Record<SessionId, SessionProgress>>;
  lastSessionId?: SessionId;
  setStep: (sessionId: SessionId, stepIndex: number, slideIndex?: number) => void;
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
      setStep: (sessionId, stepIndex, slideIndex = 0) =>
        set((state) => ({
          lastSessionId: sessionId,
          sessions: {
            ...state.sessions,
            [sessionId]: {
              ...(state.sessions[sessionId] ?? emptyProgress),
              stepIndex,
              slideIndex,
            },
          },
        })),
      setCount: (sessionId, stepId, count) =>
        set((state) => {
          const current = state.sessions[sessionId] ?? emptyProgress;
          const previous = current.counts[stepId] ?? 0;
          const laps = (current.laps?.[stepId] ?? []).slice(0, count);
          // 0 = time unknown (rounds counted before lap times were recorded).
          while (laps.length < Math.min(previous, count)) laps.push(0);
          while (laps.length < count) laps.push(Date.now());
          return {
            lastSessionId: sessionId,
            sessions: {
              ...state.sessions,
              [sessionId]: {
                ...current,
                counts: { ...current.counts, [stepId]: count },
                laps: { ...current.laps, [stepId]: laps },
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
