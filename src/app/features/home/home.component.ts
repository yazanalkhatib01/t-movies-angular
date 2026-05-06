import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
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
export class HomeComponent implements OnInit {
  heroMovies: Movie[] = [];
  recommendedMovies: Movie[] = [];
  trendingMovies: Movie[] = [];
  trendingSeries: Movie[] = [];
  imdbMovies: Movie[] = [];
  imdbSeries: Movie[] = [];
  trendingTvShows: Movie[] = [];
  watchlist: Movie[] = [];
  genresMap: Record<number, string> = {};
  genresList: Genre[] = [];
  genreMovies: Movie[] = [];
  activeGenreId: number | null = null;

  constructor(
    private tmdb: TmdbService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.tmdb.getGenres().subscribe((res) => {
      res.genres.forEach((g: Genre) => (this.genresMap[g.id] = g.name));
      this.cdr.detectChanges();
    });

    this.tmdb.getHeroMovies().subscribe((movies) => {
      this.heroMovies = movies;
      this.cdr.detectChanges();
    });

    this.tmdb.getRecommendedMovies().subscribe((res) => {
      this.recommendedMovies = res.results;
      this.imdbMovies = res.results.slice(0, 6);
      this.watchlist = res.results.slice(6, 12);
      this.cdr.detectChanges();
    });

    this.tmdb.getTrendingMovies().subscribe((res) => {
      this.trendingMovies = res.results;
      this.cdr.detectChanges();
    });

    this.tmdb.getTrendingSeries().subscribe((res) => {
      this.trendingSeries = res.results;
      this.imdbSeries = res.results.slice(0, 6);
      this.trendingTvShows = res.results.slice(6, 12);
      this.cdr.detectChanges();
    });

    this.tmdb.getGenres().subscribe((res) => {
      res.genres.forEach((g: Genre) => (this.genresMap[g.id] = g.name));
      this.genresList = res.genres.slice(0, 8);
      this.cdr.detectChanges();

      if (this.genresList.length > 0) {
        this.selectGenre(this.genresList[0]);
      }
    });
  }

  selectGenre(genre: Genre): void {
    this.activeGenreId = genre.id;
    this.tmdb.getMoviesByGenre(genre.id).subscribe((res) => {
      this.genreMovies = res.results.slice(0, 6);
      this.cdr.detectChanges();
    });
  }
}
