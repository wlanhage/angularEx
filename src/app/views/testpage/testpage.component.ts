import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerticalBarChartComponent } from '../../components/vertical-bar-chart/vertical-bar-chart.component';
import {NumbersCardChartComponent} from '../../components/numbers-card-chart/numbers-card-chart.component';

@Component({
  selector: 'app-testpage',
  standalone: true,
  imports: [CommonModule, VerticalBarChartComponent, NumbersCardChartComponent],
  templateUrl: './testpage.component.html',
  styleUrl: './testpage.component.scss'
})
export class TestpageComponent {



}
