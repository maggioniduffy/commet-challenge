export interface Sale {
  id: string;
  amount: number;
  salesperson: string;
  date: Date;
  comission?: number;
}

export interface UpcomingCMR {
  id: number;
  name: string;
  mimeType: string;
  size: number;
  created_at: Date;
  path: string;
  crmId: number | null;
}
