import { Component, signal, computed, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TmdbService } from '../../core/services/tmdb.service';
import { Movie, Genre } from '../../core/models/movie.model';
import { HeroComponent } from './components/hero/hero.component';
import { MoviesGridComponent } from './components/movies-grid/movies-grid.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeroComponent, MoviesGridComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private tmdb = inject(TmdbService);
  private destroyRef = inject(DestroyRef);

  heroMovies = signal<Movie[]>([]);
  recommendedMovies = signal<Movie[]>([]);
  trendingMovies = signal<Movie[]>([]);
  trendingSeries = signal<Movie[]>([]);
  imdbMovies = signal<Movie[]>([]);
  imdbSeries = signal<Movie[]>([]);
  trendingTvShows = signal<Movie[]>([]);
  watchlist = signal<Movie[]>([]);
  genreMovies = signal<Movie[]>([]);
  genresList = signal<Genre[]>([]);
  activeGenreId = signal<number | null>(null);
  genresMap = signal<Record<number, string>>({});

  heroGenresMap = computed(() => this.genresMap());

  constructor() {
    this.tmdb
      .getGenres()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        const map: Record<number, string> = {};
        res.genres.forEach((g: Genre) => (map[g.id] = g.name));
        this.genresMap.set(map);
        this.genresList.set(res.genres.slice(0, 8));
        if (res.genres.length > 0) this.selectGenre(res.genres[0]);
      });

    this.tmdb
      .getHeroMovies()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((movies) => this.heroMovies.set(movies));

    this.tmdb
      .getRecommendedMovies()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.recommendedMovies.set(res.results);
        this.imdbMovies.set(res.results.slice(0, 6));
        this.watchlist.set(res.results.slice(6, 12));
      });

    this.tmdb
      .getTrendingMovies()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => this.trendingMovies.set(res.results));

    this.tmdb
      .getTrendingSeries()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.trendingSeries.set(res.results);
        this.imdbSeries.set(res.results.slice(0, 6));
        this.trendingTvShows.set(res.results.slice(6, 12));
      });
  }

  selectGenre(genre: Genre): void {
    this.activeGenreId.set(genre.id);
    this.tmdb
      .getMoviesByGenre(genre.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => this.genreMovies.set(res.results.slice(0, 6)));
  }
}
