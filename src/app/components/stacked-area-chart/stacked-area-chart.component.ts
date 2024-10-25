import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Color, ScaleType, NgxChartsModule } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import { CovidapiService } from '../../services/covidapi.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-stacked-area-chart',
  standalone: true,
  imports: [NgxChartsModule, CommonModule],
  templateUrl: './stacked-area-chart.component.html',
  styleUrl: './stacked-area-chart.component.scss'
})
export class StackedAreaChartComponent implements OnInit {
  @Input() selectedCountry: any;
  @Input() selectedDate: any;
  @Input() displayMode: 'dashboard' | 'compare' = 'dashboard';
  @Input() compareCountries: any[] = [];
  componentData: any[] = [];

  constructor(private covidApiService: CovidapiService) {}

  ngOnInit(): void {
    this.getCountryDataForYears();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCountry'] && !changes['selectedCountry'].firstChange) {
      this.getCountryDataForYears();
    }
    if (changes['compareCountries'] && !changes['compareCountries'].firstChange) {
      this.getCountryDataForYears();
    }
  }

  getCountryDataForYears(): void {
    if (this.displayMode === 'dashboard' && this.selectedCountry && this.selectedCountry.iso) {
      const dates = ['2020-03-01', '2021-03-01', '2022-03-01', '2023-03-01'];
      const requests = dates.map(date => this.covidApiService.getSingleCountry(this.selectedCountry.iso, date));

      forkJoin(requests).subscribe(
        (responses) => {
          this.componentData = [
            {
              name: 'Deaths',
              series: responses.map((response, index) => ({
                name: dates[index].split('-')[0],
                value: response.data.deaths
              }))
            },
            {
              name: 'Confirmed',
              series: responses.map((response, index) => ({
                name: dates[index].split('-')[0],
                value: response.data.confirmed
              }))
            }
          ];

          console.log(this.componentData);
        },
        (error) => {
          console.error('Error fetching country data for years', error);
        }
      );
    } else if (this.displayMode === 'compare' && this.compareCountries.length > 0) {
      this.componentData = this.compareCountries.map(country => ({
        name: country.name,
        value: country.confirmed
      }));

      console.log(this.componentData);
    }
  }


}
