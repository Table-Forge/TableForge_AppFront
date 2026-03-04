export interface IPlayer {
  id: string | number;
  name: string;
  avatar: string;
}

export interface ISessionSchedule {
  day: string;
  time: string;
}

interface ICampaign {
  id: number;
  title: string;
  image: string;
  system: string;
  gameMaster: string;

  location: string;
  level: "Iniciante" | "Intermediário" | "Veterano" | "Avançado" | "Lenda";

  summary: string;
  fullDescription: string;

  currentPartySize: number;
  maxPartySize: number;
  players?: IPlayer[];

  frequency?: "Semanal" | "Quinzenal" | "Mensal" | "One-shot";
  nextSession?: ISessionSchedule;
}

export type { ICampaign };
