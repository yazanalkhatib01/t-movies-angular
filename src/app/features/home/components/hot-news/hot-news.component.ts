import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TmdbService } from '../../../../core/services/tmdb.service';

interface NewsItem {
  id: number;
  title: string;
  overview: string;
  image: string;
  date: string;
}

@Component({
  selector: 'app-hot-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hot-news.component.html',
  styleUrl: './hot-news.component.css',
})
export class HotNewsComponent {
  private tmdb = inject(TmdbService);

  newsList = signal<NewsItem[]>([]);
  currentIndex = signal(0);
  currentNews = computed(() => this.newsList()[this.currentIndex()] ?? null);

  constructor() {
    this.tmdb
      .getUpcomingMovies()
      .pipe(takeUntilDestroyed())
      .subscribe((res) => {
        this.newsList.set(
          res.results.slice(0, 6).map((movie) => ({
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            image: this.tmdb.getImageUrl(movie.backdrop_path || movie.poster_path),
            date: new Date(movie.release_date).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'long',
            }),
          })),
        );
      });
  }

  next(): void {
    this.currentIndex.update((i) => (i + 1) % this.newsList().length);
  }

  prev(): void {
    this.currentIndex.update((i) => (i - 1 + this.newsList().length) % this.newsList().length);
  }
}
