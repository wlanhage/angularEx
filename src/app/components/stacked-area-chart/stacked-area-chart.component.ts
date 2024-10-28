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
  styleUrls: ['./stacked-area-chart.component.scss']
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
      console.log('selectedCountry changed:', changes['selectedCountry'].currentValue);
      this.getCountryDataForYears();
    }
    if (changes['compareCountries']) {
      console.log('compareCountries changed:', changes['compareCountries'].currentValue);
      if (!changes['compareCountries'].firstChange) {
        this.getCountryDataForYears();
      }
    }
  }

  getCountryDataForYears(): void {
    const dates = ['2020-03-01', '2021-03-01', '2022-03-01', '2023-03-01'];
    console.log('Fetching data for dates:', dates);

    if (this.displayMode === 'dashboard' && this.selectedCountry && this.selectedCountry.iso) {
      console.log('Dashboard mode: Fetching data for country:', this.selectedCountry);
      const requests = dates.map(date => this.covidApiService.getSingleCountry(this.selectedCountry.iso, date));
      forkJoin(requests).subscribe(
        (responses) => {
          console.log('Responses for dashboard mode:', responses);
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
          console.log('Component data for dashboard mode:', this.componentData);
        },
        (error) => {
          console.error('Error fetching country data for years', error);
        }
      );
    } else if (this.displayMode === 'compare' && this.compareCountries.length > 0) {
      console.log('Compare mode: Fetching data for countries:', this.compareCountries);
      const requests = this.compareCountries.map(country => {
        return dates.map(date => this.covidApiService.getSingleCountry(country.iso, date));
      }).flat();
      forkJoin(requests).subscribe(
        (responses) => {
          console.log('Responses for compare mode:', responses);
          responses.forEach((response, index) => {
            console.log(`Response for ${this.compareCountries[Math.floor(index / dates.length)].name} on ${dates[index % dates.length]}:`, response);
          });
          const groupedResponses = this.groupResponsesByCountry(responses, dates.length);
          console.log('Grouped responses:', groupedResponses);
          this.componentData = this.compareCountries.map((country, countryIndex) => ({
            name: country.name,
            series: groupedResponses[countryIndex].map((response, dateIndex) => {
              console.log(`Processing response for ${country.name} on ${dates[dateIndex]}:`, response);
              return {
                name: dates[dateIndex].split('-')[0],
                value: response.data.confirmed
              };
            })
          }));
          console.log('Component data for compare mode:', this.componentData);
        },
        (error) => {
          console.error('Error fetching country data for comparison', error);
        }
      );
    }
  }

  private groupResponsesByCountry(responses: any[], datesLength: number): any[][] {
    const groupedResponses = [];
    for (let i = 0; i < responses.length; i += datesLength) {
      groupedResponses.push(responses.slice(i, i + datesLength));
    }
    console.log('Grouped responses by country:', groupedResponses);
    return groupedResponses;
  }
}
