import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-homebutton',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './homebutton.component.html',
  styleUrl: './homebutton.component.scss'
})
export class HomebuttonComponent {
  constructor(private router: Router) {}
  navigateToHome(): void {
    this.router.navigate(['/'])
  }

}
