import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  profileImg = '';

  ngOnInit(): void {
    const randomId = Math.floor(Math.random() * 70) + 1;
    this.profileImg = `https://i.pravatar.cc/150?img=${randomId}`;
  }
}
