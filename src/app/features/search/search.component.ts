import { Component, signal, inject, computed, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, Subject } from 'rxjs';
import { TmdbService } from '../../core/services/tmdb.service';
import { Movie } from '../../core/models/movie.model';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  private tmdb = inject(TmdbService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  query = signal('');
  results = signal<Movie[]>([]);
  loading = signal(false);
  isEmpty = computed(
    () => !this.loading() && this.results().length === 0 && this.query().length > 0,
  );

  private search$ = new Subject<string>();

  constructor() {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      if (params['q']) {
        this.query.set(params['q']);
        this.doSearch(params['q']);
      }
    });

    this.search$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((q) => {
          this.loading.set(true);
          return this.tmdb.searchMovies(q);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((res) => {
        this.results.set(res.results.filter((m: any) => m.poster_path));
        this.loading.set(false);
      });
  }

  onInput(event: Event): void {
    const q = (event.target as HTMLInputElement).value;
    this.query.set(q);
    if (q.trim().length > 0) {
      this.router.navigate(['/search'], { queryParams: { q } });
      this.search$.next(q);
    } else {
      this.results.set([]);
    }
  }

  doSearch(q: string): void {
    this.loading.set(true);
    this.tmdb
      .searchMovies(q)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.results.set(res.results.filter((m: any) => m.poster_path));
        this.loading.set(false);
      });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
