import { Component, signal, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TmdbService } from '../../core/services/tmdb.service';
import { MoviesGridComponent } from '../home/components/movies-grid/movies-grid.component';
import { Movie } from '../../core/models/movie.model';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, MoviesGridComponent],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css',
})
export class MovieDetailComponent {
  private tmdb = inject(TmdbService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  movie = signal<any>(null);
  credits = signal<any[]>([]);
  similar = signal<Movie[]>([]);

  constructor() {
    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => this.loadMovie(+params['id']));
  }

  loadMovie(id: number): void {
    this.tmdb
      .getMovieDetails(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((movie) => this.movie.set(movie));

    this.tmdb
      .getMovieCredits(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => this.credits.set(res.cast.slice(0, 10)));

    this.tmdb
      .getSimilarMovies(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => this.similar.set(res.results.slice(0, 10)));
  }

  getBackdrop(): string {
    return `https://image.tmdb.org/t/p/w1280${this.movie()?.backdrop_path}`;
  }

  getPoster(): string {
    return this.tmdb.getImageUrl(this.movie()?.poster_path);
  }

  getProfileImg(path: string): string {
    return path ? this.tmdb.getImageUrl(path) : 'https://i.pravatar.cc/150?img=1';
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
