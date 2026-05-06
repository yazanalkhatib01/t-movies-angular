import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../../core/models/movie.model';
import { TmdbService } from '../../../core/services/tmdb.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.css',
})
export class MovieCardComponent {
  @Input() movie!: Movie;
  isFavorite = false;

  constructor(private tmdb: TmdbService) {}

  getImage(): string {
    return this.tmdb.getImageUrl(this.movie.poster_path);
  }

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    this.isFavorite = !this.isFavorite;
  }
}
