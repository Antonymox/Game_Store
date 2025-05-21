import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Game } from '../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private games: Game[] = [
    {
      id: 1,
      title: 'Cyberpunk 2077',
      description: 'Cyberpunk 2077 es un RPG de aventura y acción de mundo abierto ambientado en el futuro sombrío de Night City.',
      price: 59.99,
      imageUrl: '/asset/cyber.png',
      screenShots: [
      "/asset/screenshots/ciber1.png",
      "/asset/screenshots/ciber2.png",
      "/asset/screenshots/ciber3.png"
      ],
      category: 'RPG',
      releaseDate: '2020-12-10',
      publisher: 'CD Projekt RED',
      rating: 4.2,
      discount: 0.2
    },
    {
      id: 2,
      title: 'The Last of Us Part II',
      description: 'Cinco años después de su peligroso viaje a través de los Estados Unidos, Ellie y Joel se han establecido en Jackson, Wyoming.',
      price: 49.99,
      imageUrl: '/asset/us.png',
      screenShots: [
      "/asset/screenshot4.png",
      "/asset/screenshot5.png",
      "/asset/screenshot1.png"
      ],
      category: 'Acción/Aventura',
      releaseDate: '2020-06-19',
      publisher: 'Sony Interactive Entertainment',
      rating: 4.8
    },
    {
      id: 3,
      title: 'FIFA 23',
      description: 'FIFA 23 nos acerca al mayor juego del mundo con avances tecnológicos que aumentan el realismo.',
      price: 39.99,
      imageUrl: '/asset/fifa23.png',
      screenShots: [
      "/asset/screenshot1.png",
      "/asset/screenshot1.png",
      "/asset/screenshot1.png"
      ],
      category: 'Deportes',
      releaseDate: '2022-09-30',
      publisher: 'EA Sports',
      rating: 4.0,
      discount: 0.15
    },
    {
      id: 4,
      title: 'Elden Ring',
      description: 'Elden Ring es un RPG de acción desarrollado por FromSoftware y publicado por Bandai Namco Entertainment.',
      price: 59.99,
      imageUrl: '/asset/elden.png',
      screenShots: [
      "/asset/screenshot1.png",
      "/asset/screenshot1.png",
      "/asset/screenshot1.png"
      ],
      category: 'RPG',
      releaseDate: '2022-02-25',
      publisher: 'Bandai Namco',
      rating: 4.9
    },
    {
      id: 5,
      title: 'Call of Duty: Modern Warfare II',
      description: 'Call of Duty: Modern Warfare II es un videojuego de disparos en primera persona desarrollado por Infinity Ward.',
      price: 69.99,
      imageUrl: '/asset/call.png',
      screenShots: [
      "/asset/screenshot1.png",
      "/asset/screenshot1.png",
      "/asset/screenshot1.png"
      ],
      category: 'FPS',
      releaseDate: '2022-10-28',
      publisher: 'Activision',
      rating: 4.3
    },
    {
      id: 6,
      title: 'Horizon Forbidden West',
      description: 'Horizon Forbidden West continúa la historia de Aloy, una cazadora que viaja a una nueva frontera.',
      price: 49.99,
      imageUrl: '/asset/horizon.png',
      screenShots: [
      "/asset/screenshot1.png",
      "/asset/screenshot1.png",
      "/asset/screenshot1.png"
      ],
      category: 'Acción/Aventura',
      releaseDate: '2022-02-18',
      publisher: 'Sony Interactive Entertainment',
      rating: 4.7,
      discount: 0.1
    }
  ];

  constructor() { }

  getGames(): Observable<Game[]> {
    return of(this.games);
  }

  getGame(id: number): Observable<Game | undefined> {
    const game = this.games.find(g => g.id === id);
    return of(game);
  }

  getGamesByCategory(category: string): Observable<Game[]> {
    const filteredGames = this.games.filter(g => g.category === category);
    return of(filteredGames);
  }

  searchGames(term: string): Observable<Game[]> {
    if (!term.trim()) {
      return of([]);
    }
    
    const filteredGames = this.games.filter(game => 
      game.title.toLowerCase().includes(term.toLowerCase()) ||
      game.description.toLowerCase().includes(term.toLowerCase())
    );
    
    return of(filteredGames);
  }
}
