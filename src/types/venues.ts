export interface VenueRaw {
  id: string;
  name: string;
  address: string;
  web: string;
  position?: {
    lat: number;
    lng: number;
  };
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  web: string;
  position?: {
    lat: number;
    lng: number;
  };
}

export type Venues = Venue[];
