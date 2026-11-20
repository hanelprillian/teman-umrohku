import type { SessionId } from "../content/types";

export type RootStackParamList = {
  Home: undefined;
  Session: { id: SessionId };
  Settings: undefined;
  Doas: undefined;
  IhramRules: undefined;
};
