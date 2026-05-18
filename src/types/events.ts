export interface Event {
  id: string;
  title: string;
  author: string;
  initial_date: number;
  final_date: number;
  images: string[];
  description: string;
  location: string;
}

export type Events = Event[];
