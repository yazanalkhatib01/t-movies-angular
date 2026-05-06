import { Component, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../../../core/models/movie.model';
import { TmdbService } from '../../../../core/services/tmdb.service';
import { HotNewsComponent } from '../hot-news/hot-news.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, HotNewsComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent implements OnChanges {
  @Input() movies: Movie[] = [];
  @Input() genresMap: Record<number, string> = {};

  currentIndex = 0;
  isAnimating = false;

  constructor(
    private tmdb: TmdbService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnChanges(): void {
    this.currentIndex = 0;
  }

  get currentMovie(): Movie | null {
    return this.movies[this.currentIndex] ?? null;
  }

  getImage(path: string): string {
    return `https://image.tmdb.org/t/p/w780${path}`;
  }

  getGenres(): string {
    return (
      this.currentMovie?.genre_ids
        .map((id) => this.genresMap[id])
        .filter(Boolean)
        .join(' • ') ?? ''
    );
  }

  navigate(dir: 1 | -1): void {
    if (this.isAnimating || this.movies.length === 0) return;
    this.isAnimating = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.currentIndex = (this.currentIndex + dir + this.movies.length) % this.movies.length;
      this.isAnimating = false;
      this.cdr.detectChanges();
    }, 300);
  }
}
