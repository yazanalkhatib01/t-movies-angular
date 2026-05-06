import { Component, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../../../core/models/movie.model';
import { MovieCardComponent } from '../../../../shared/components/movie-card/movie-card.component';

@Component({
  selector: 'app-movies-grid',
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  templateUrl: './movies-grid.component.html',
  styleUrl: './movies-grid.component.css',
})
export class MoviesGridComponent implements AfterViewInit {
  @Input() movies: Movie[] = [];
  @ViewChild('grid') gridRef!: ElementRef<HTMLDivElement>;

  private isDown = false;
  private startX = 0;
  private scrollLeft = 0;

  ngAfterViewInit(): void {
    const el = this.gridRef.nativeElement;

    el.addEventListener('mousedown', (e) => {
      this.isDown = true;
      this.startX = e.pageX - el.offsetLeft;
      this.scrollLeft = el.scrollLeft;
    });

    el.addEventListener('mouseleave', () => (this.isDown = false));
    el.addEventListener('mouseup', () => (this.isDown = false));

    el.addEventListener('mousemove', (e) => {
      if (!this.isDown) return;
      e.preventDefault();
      const el2 = this.gridRef.nativeElement;
      el2.scrollLeft = this.scrollLeft - (e.pageX - el2.offsetLeft - this.startX) * 1.5;
    });
  }
}
