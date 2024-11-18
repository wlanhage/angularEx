import { Component, HostListener, Input, OnInit, SimpleChanges, ChangeDetectorRef } from '@angular/core';
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
  [x: string]: any;
  @Input() selectedCountry: any;
  @Input() selectedDate: any;
  @Input() displayMode: 'dashboard' | 'compare' = 'dashboard';
  @Input() compareCountries: any[] = [];
  @Input() dataType: string = 'confirmed'
  componentData: any[] = [];
  view: [number, number] = [1000, 500];
  showLegend: boolean = true;
  showYAxis: boolean = true;
  showXAxis: boolean = true;

  constructor(
    private covidApiService: CovidapiService,
    private cdr: ChangeDetectorRef

  ) {}

  ngOnInit(): void {
    this.getCountryDataForYears();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.updateChartSize();
  }

  updateChartSize(): void {
    const width = window.innerWidth * 0.7;
    const height = window.innerHeight * 0.7;
    this.view = [width, height];
    this.showLegend = window.innerWidth > 768;
    this.showYAxis = window.innerWidth > 768;
    this.showXAxis = window.innerWidth > 768;
    this.cdr.detectChanges();
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
    const dates = ['2019-03-01','2020-03-01', '2021-03-01', '2022-03-01', '2023-03-01'];
    console.log('Fetching data for dates:', dates);

    if (this.displayMode === 'dashboard' && this.selectedCountry && this.selectedCountry.iso) {
      console.log('Dashboard mode: Fetching data for country:', this.selectedCountry);
      const requests = dates.map(date => this.covidApiService.getSingleCountryWithDate(this.selectedCountry.iso, date));
      forkJoin(requests).subscribe(
        (responses) => {
          console.log('Responses for dashboard mode:', responses);
          this.componentData = [
            {
              name: 'Deaths',
              series: responses.map((response, index) => ({
                name: dates[index].split('-')[0],
                value: response.data.deaths ?? 0
              }))
            },
            {
              name: 'Confirmed',
              series: responses.map((response, index) => ({
                name: dates[index].split('-')[0],
                value: this.dataType === 'confirmed' ? response.data.confirmed ?? 0 : response.data.deaths ?? 0
              }))
            }
          ];
          console.log('Component data för dashboard:', this.componentData);
        },
        (error) => {
          console.error('Error fetching country data for years', error);
        }
      );
    } else if (this.displayMode === 'compare' && this.compareCountries.length > 0) {
      console.log('Compare mode: Fetching data for countries:', this.compareCountries);
      const requests = this.compareCountries.map(country => {
        return dates.map(date => this.covidApiService.getSingleCountryWithDate(country.iso, date));
      }).flat();


      forkJoin(requests).subscribe(
        (responses) => {
          const groupedResponses = this.groupResponsesByCountry(responses, dates.length);
          console.log('Grouped responses:', groupedResponses);
          this.componentData = this.compareCountries.map((country, countryIndex) => ({
            name: country.name,
            series: groupedResponses[countryIndex].map((response, dateIndex) => {
              console.log(`Processing response for ${country.name} on ${dates[dateIndex]}:`, response);
              return {
                name: dates[dateIndex].split('-')[0],
                value: this.dataType === 'confirmed' ? (response.data.confirmed ?? 0) : (response.data.deaths ?? 0)
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
    const groupedResponses: any[][] = [];
    for (let i = 0; i < responses.length; i += datesLength) {
      groupedResponses.push(responses.slice(i, i + datesLength));
    }
    return groupedResponses;
  }
}
