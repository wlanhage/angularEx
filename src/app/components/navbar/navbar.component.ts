import { Component, EventEmitter, Output, HostListener } from '@angular/core';
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

  ngOnInit(): void {
    this.checkWindowSize();
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard'])
  }

  navigateToCompare(): void {
    this.router.navigate(['/compare'])
  }

  navigateTohome(): void {
    this.router.navigate(['/'])
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkWindowSize();
  }

  checkWindowSize(): void {
    if (typeof window !== 'undefined' && window.innerWidth > 1000) {
      this.isAsideOpen = true;
    } else {
      this.isAsideOpen = false;
    }
    this.asideToggled.emit(this.isAsideOpen);
  }

  toggleAside(): void {
    this.isAsideOpen = !this.isAsideOpen;
    this.asideToggled.emit(this.isAsideOpen);
    console.log('aside toggled', this.isAsideOpen)
  }

}
