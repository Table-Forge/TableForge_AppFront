import { TPrimitives } from "@/src/interfaces/primitives.interfaces";

type TOptions = {
  name: string;
  value: TPrimitives | undefined;
};

type IEnumOption = {
  id: number;
  value: string;
  name: string;
  allowSelect: boolean;
};

export type { TOptions, IEnumOption };
