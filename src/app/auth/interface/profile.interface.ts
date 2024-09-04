export interface Profile {
  uuid: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  profession: string;
  role: 'client' | 'contractor';
  balance?: number;
}

export interface depositMoney {
  amount: number;
}
