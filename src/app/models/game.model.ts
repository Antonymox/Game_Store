export interface Game {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  screenShots: string[];
  category: string;
  releaseDate: string;
  publisher: string;
  rating: number;
  discount?: number;
  
 
}
