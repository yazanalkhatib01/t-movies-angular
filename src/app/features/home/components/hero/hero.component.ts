import { Component, input, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../../../core/models/movie.model';
import { HotNewsComponent } from '../hot-news/hot-news.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, HotNewsComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent {
  movies = input<Movie[]>([]);
  genresMap = input<Record<number, string>>({});

  currentIndex = signal(0);
  isAnimating = signal(false);

  currentMovie = computed(() => this.movies()[this.currentIndex()] ?? null);

  constructor() {
    effect(() => {
      if (this.movies().length > 0) {
        this.currentIndex.set(0);
      }
    });
  }

  getImage(path: string): string {
    return `https://image.tmdb.org/t/p/w780${path}`;
  }

  getGenres(): string {
    return (
      this.currentMovie()
        ?.genre_ids.map((id) => this.genresMap()[id])
        .filter(Boolean)
        .join(' • ') ?? ''
    );
  }

  navigate(dir: 1 | -1): void {
    if (this.isAnimating() || this.movies().length === 0) return;
    this.isAnimating.set(true);
    setTimeout(() => {
      this.currentIndex.update((i) => (i + dir + this.movies().length) % this.movies().length);
      this.isAnimating.set(false);
    }, 300);
  }
}
