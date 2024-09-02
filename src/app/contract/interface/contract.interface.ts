export interface Contract {
  uuid?: string;
  terms: string;
  status?: 'new' | 'in_progress' | 'terminated';
  client_id: string;
  contractor_id: string;
}
