import { Component, EventEmitter, Output } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ MaterialModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Output() asideToggled = new EventEmitter<boolean>();

  constructor(
    private router: Router,
  ) {}

  isAsideOpen = false;

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard'])
  }

  navigateToCompare(): void {
    this.router.navigate(['/compare'])
  }

  navigateTohome(): void {
    this.router.navigate(['/'])
  }

  toggleAside(): void {
    this.isAsideOpen = !this.isAsideOpen;
    this.asideToggled.emit(this.isAsideOpen);
    console.log('aside toggled', this.isAsideOpen)
  }

}
