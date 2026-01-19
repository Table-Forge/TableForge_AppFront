interface ICampaign {
  id: number;
  title: string;
  image: string;
  summary: string;
  location: string;
  system: string;
  level: string;
  currentPartySize: number;
  maxPartySize: number;
}

export type { ICampaign };
