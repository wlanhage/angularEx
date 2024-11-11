import { Component, OnInit } from '@angular/core';
import { CovidapiService } from '../../services/covidapi.service';
import { Color, NgxChartsModule } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-numbers-card-chart',
  standalone: true,
  imports: [NgxChartsModule, CommonModule],
  templateUrl: './numbers-card-chart.component.html',
  styleUrls: ['./numbers-card-chart.component.scss']
})
export class NumbersCardChartComponent implements OnInit {
  randomCountries: any[] = [];
  view: [number, number] = [6000, 150]; // Adjust for a horizontal layout
  cardColor: string = '#232837';
  dataLoaded: boolean = false;

  constructor(private covidApiService: CovidapiService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.covidApiService.getCountries().subscribe(
      (response) => {
        console.log('API response:', response);


        const allCountries = response.data.map((country: any) => ({
          name: country.name, // Hämta alla countries
          iso: country.iso
        }));


        for (let i = allCountries.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1)); // Shuffla
          [allCountries[i], allCountries[j]] = [allCountries[j], allCountries[i]];
        }

        const selectedCountries = allCountries.slice(0, 20); // Första 20


        const countryRequests: Observable<any>[] = selectedCountries.map((country: any) =>
          this.covidApiService.getSingleCountry(country.iso).pipe( // Mappa ut countires för att kunna
            catchError((error) => {                               // hämta detaljerad data från annan API endpoint
              console.error(`Error fetching data for ${country.name}`, error);
              return of({ data: { confirmed: 0 } }); // Fallback data om request misslyckas
            })
          )
        );


        forkJoin<any[]>(countryRequests).subscribe( // Forkjoin för att mergea returnen av 2 api calls
          (countryResponses: any[]) => {
            this.randomCountries = countryResponses.map((response: any, index: number) => ({
              name: selectedCountries[index].name,
              value: response.data.confirmed
            }));
            this.dataLoaded = true;

            console.log('Data for number card chart:', this.randomCountries);
          },
          (error) => {
            console.error('Error fetching detailed country data', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching data for number card chart', error);
      }
    );
  }

  onSelect(event: any): void {
    console.log(event);
  }
}
