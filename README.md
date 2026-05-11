# T.Movies

A modern movie discovery app built with **Angular 21**, powered by the TMDB API.

---

## Tech Stack

| Technology | Version |
| ---------- | ------- |
| Angular    | 21.2.11 |
| TypeScript | 5.x     |
| TMDB API   | v3      |
| Node.js    | 24.x    |

---

## Features

- **Hero Slider** — Trending movies with auto-navigation
- **Movie Detail** — Full info, cast, and similar movies
- **Search** — Real-time search with debounce
- **Genres** — Filter movies by genre
- **Hot News** — Upcoming movies sidebar
- **Favorite** — Mark movies as favorite

---

## 🏗️ Project Structure

```
src/app/
├── core/
│   ├── models/        ← Movie, Genre interfaces
│   └── services/      ← TMDB API service
├── features/
│   ├── home/          ← Main page + components
│   ├── movie-detail/  ← Movie detail page
│   └── search/        ← Search page
└── shared/
    └── components/    ← movie-card, header
```
