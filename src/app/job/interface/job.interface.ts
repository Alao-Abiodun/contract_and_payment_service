export interface Job {
  uuid: string;
  description: string;
  price?: number;
  is_paid?: boolean;
  paid_date?: Date;
  contract_id: string;
}
