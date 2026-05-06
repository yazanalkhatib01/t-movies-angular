import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private router = inject(Router);

  profileImg = signal(`https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`);

  onSearch(event: Event): void {
    const q = (event.target as HTMLInputElement).value.trim();
    if (q) this.router.navigate(['/search'], { queryParams: { q } });
  }
}
