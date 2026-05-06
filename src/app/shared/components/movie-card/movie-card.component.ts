import { Component, input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
  private tmdb = inject(TmdbService);
  private router = inject(Router);

  movie = input.required<Movie>();
  isFavorite = signal(false);

  getImage(): string {
    return this.tmdb.getImageUrl(this.movie().poster_path);
  }

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    this.isFavorite.update((v) => !v);
  }

  navigateToDetail(): void {
    this.router.navigate(['/movie', this.movie().id]);
  }
}
