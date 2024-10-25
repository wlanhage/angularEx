import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard'])
  }

  navigateToTestpage(): void {
    this.router.navigate(['/testpage'])
  }

  navigateToCompare(): void {
    this.router.navigate(['compare'])
  }

}
