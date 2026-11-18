export type DalilStatus =
  | "quran"
  | "shahih"
  | "hasan"
  | "atsar"
  | "diperselisihkan";

export interface Dalil {
  source: string;
  status: DalilStatus;
  quote?: string;
  note?: string;
}

export interface Dua {
  id: string;
  title?: string;
  arabic: string;
  latin: string;
  translation: string;
  repeat?: string;
  dalil: Dalil[];
}

export type Audience = "pria" | "wanita";

export interface Tip {
  text: string;
  audience?: Audience;
  warning?: boolean;
}

export interface CounterRound {
  label: string;
  hint?: string;
}

export interface Counter {
  total: number;
  unit: string;
  tapLabel: string;
  rounds: CounterRound[];
}

export interface Step {
  id: string;
  title: string;
  optional?: boolean;
  instructions: string[];
  counter?: Counter;
  duas?: Dua[];
  tips?: Tip[];
  dalil?: Dalil[];
}

export type SessionId =
  | "ihram"
  | "tawaf"
  | "maqam"
  | "zamzam"
  | "sai"
  | "tahallul";

export interface Session {
  id: SessionId;
  title: string;
  subtitle: string;
  steps: Step[];
}
