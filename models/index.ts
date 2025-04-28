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

export interface CRM {
  id?: number;
  original_crm_id?: number;
  created_at: Date;
}

export interface File {
  content: string;
  type: string;
  id: number;
}
