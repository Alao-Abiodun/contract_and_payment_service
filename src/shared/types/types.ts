export interface SiteData {
  name: string;
  number: string;
  long: string;
  lat: string;
  isBrewery: boolean;
}

export interface CustomerData {
  id: string;
  name: string;
  email: string | null;
  country: string;
  state: string | null;
  phone: string | null;
  openingHours: string | null;
  address: string;
  long: number | null;
  lat: number | null;
  createdAt: string;
  region: string | null;
  paymentFilter: string | null;
  updatedAt: string;
}
