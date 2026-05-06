import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Movie, Genre, ApiResponse } from '../models/movie.model';
import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class TmdbService {
  private base = environment.baseUrl;
  private key = environment.apiKey;

  constructor(private http: HttpClient) {}

  private get<T>(endpoint: string): Observable<T> {
    const params = new HttpParams().set('api_key', this.key);
    return this.http.get<T>(`${this.base}${endpoint}`, { params });
  }

  getRecommendedMovies(): Observable<ApiResponse<Movie>> {
    return this.get('/movie/top_rated');
  }

  getTrendingMovies(): Observable<ApiResponse<Movie>> {
    return this.get('/trending/movie/week');
  }

  getHeroMovies(): Observable<Movie[]> {
    return this.get<ApiResponse<Movie>>('/trending/movie/day').pipe(
      map((res) => res.results.slice(0, 5)),
    );
  }

  getGenres(): Observable<{ genres: Genre[] }> {
    return this.get('/genre/movie/list');
  }

  getImageUrl(path: string): string {
    return `${environment.imageBaseUrl}${path}`;
  }

  getTrendingSeries(): Observable<ApiResponse<Movie>> {
    return this.get('/trending/tv/week');
  }

  getMoviesByGenre(genreId: number): Observable<ApiResponse<Movie>> {
    const params = new HttpParams().set('api_key', this.key).set('with_genres', genreId.toString());
    return this.http.get<ApiResponse<Movie>>(`${this.base}/discover/movie`, { params });
  }
}
