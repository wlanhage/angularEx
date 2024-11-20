import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges, HostListener, OnChanges } from '@angular/core';
import { Color, ScaleType, NgxChartsModule } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import { CovidapiService } from '../../services/covidapi.service';
import { forkJoin } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { countriesData } from '../../models/countries-data';

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
export class VerticalBarChartComponent implements OnInit, OnChanges {
  @Input() selectedCountry: any;
  @Input() selectedDate: any;
  @Input() displayMode: 'dashboard' | 'compare' = 'dashboard';
  @Input() compareCountries: any[] = [];
  @Input() dataType: string = 'confirmed';
  componentData: any[] = [];
  view: [number, number] = [1000, 400];
  showLegend: boolean = true;
  showYAxis: boolean = true;
  showXAxis: boolean = true;

  constructor(
    private covidApiService: CovidapiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getSingleCountry();
    this.updateChartSize();
    console.log('VerticalBarChartComponent initialized with data:', this.compareCountries);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['compareCountries'] || changes['dataType']) {
      this.getSingleCountry();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.updateChartSize();
  }

  updateChartSize(): void {
    const width = window.innerWidth * 0.75;
    const height = window.innerHeight * 0.7;
    this.view = [width, height];
    this.showLegend = window.innerWidth > 768;
    this.showYAxis = window.innerWidth > 768;
    this.showXAxis = window.innerWidth > 768;
    this.cdr.detectChanges();
  }

  getSingleCountry(): void {
    if (this.displayMode === 'dashboard' && this.selectedCountry && this.selectedCountry.iso) {
      this.covidApiService.getSingleCountry(this.selectedCountry.iso).subscribe(
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
            value: this.dataType === 'confirmed' ? response.data.confirmed : response.data.deaths
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
