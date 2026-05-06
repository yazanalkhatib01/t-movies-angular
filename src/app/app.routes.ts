import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { MovieDetailComponent } from './features/movie-detail/movie-detail.component';
import { SearchComponent } from './features/search/search.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'movie/:id', component: MovieDetailComponent },
  { path: 'search', component: SearchComponent },
];
