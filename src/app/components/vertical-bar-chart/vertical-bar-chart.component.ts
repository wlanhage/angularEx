import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Color, ScaleType, NgxChartsModule } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import { CovidapiService } from '../../services/covidapi.service';
import { forkJoin } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-vertical-bar-chart',
  standalone: true,
  imports: [NgxChartsModule, CommonModule],
  templateUrl: './vertical-bar-chart.component.html',
  styleUrls: ['./vertical-bar-chart.component.scss'],
  animations: [
    trigger('animationState', [
      state('start', style({ opacity: 1 })),
      state('end', style({ opacity: 0 })),
      transition('start => end', [
        animate('1s')
      ]),
      transition('end => start', [
        animate('0.5s')
      ])
    ])
  ]
})
export class VerticalBarChartComponent implements OnInit {
  @Input() selectedCountry: any;
  @Input() selectedDate: any;
  @Input() displayMode: 'dashboard' | 'compare' = 'dashboard';
  @Input() compareCountries: any[] = [];
  componentData: any[] = [];

  constructor(private covidApiService: CovidapiService) {}

  ngOnInit(): void {
    this.getSingleCountry();
    console.log('VerticalBarChartComponent initialized with data:', this.compareCountries);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['compareCountries']) {
      this.getSingleCountry();
    }
  }

  getSingleCountry(): void {
    if (this.displayMode === 'dashboard' && this.selectedCountry && this.selectedCountry.iso) {
      this.covidApiService.getSingleCountry(this.selectedCountry.iso, this.selectedDate).subscribe(
        (response) => {
          const singleCountry = response.data;
          this.componentData = [
            { name: 'Confirmed', value: singleCountry.confirmed },
            { name: 'Deaths', value: singleCountry.deaths }
          ];
          console.log(this.componentData);
        },
        (error) => {
          console.error('Error fetching country', error);
        }
      );
    } else if (this.displayMode === 'compare' && this.compareCountries.length > 0) {
      const requests = this.compareCountries.map(country => this.covidApiService.getSingleCountry(country.iso));
      forkJoin(requests).subscribe(
        (responses) => {
          this.componentData = responses.map((response, index) => ({
            name: this.compareCountries[index].name,
            value: response.data.confirmed
          }));
          console.log('componentData:', this.componentData);
        },
        (error) => {
          console.error('Error fetching country data for comparison', error);
        }
      );
    }
  }

  onSelect(event: any): void {
    console.log(event);
  }
}
