import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { NumbersCardChartComponent } from '../../components/numbers-card-chart/numbers-card-chart.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MaterialModule, NumbersCardChartComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', '../../styleElements/styleElements.scss']
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard'])
  }
  navigateToCompare(): void {
    this.router.navigate(['/compare'])
  }

}
