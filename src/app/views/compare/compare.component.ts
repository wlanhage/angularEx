import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CovidapiService } from '../../services/covidapi.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { countriesData } from '../../models/countries-data';
import { StackedAreaChartComponent } from '../../components/stacked-area-chart/stacked-area-chart.component';
import { VerticalBarChartComponent } from "../../components/vertical-bar-chart/vertical-bar-chart.component";

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [CommonModule, FormsModule, StackedAreaChartComponent, VerticalBarChartComponent],
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit {
  countries: countriesData[] = [];
  selectedCountries: countriesData[] = [];
  compareCountries: any[] = [];
  countryToAdd: null = null;
  countryData: any[] = [];
  testData: any[] = [];

  constructor(private covidApiService: CovidapiService,) {}

  ngOnInit(): void {
    this.fetchCountries();
  }

  fetchCountries(): void {
    this.covidApiService.getCountries().subscribe(
      (response) => {
        this.countries = response.data;
      },
      (error) => {
        console.error('Error fetching countries', error);
      }
    );
  }

  addCountry(): void {
    if (this.countryToAdd && !this.selectedCountries.includes(this.countryToAdd)) {
      this.selectedCountries.push(this.countryToAdd);

      // Fetcha country data och adda till compareCountries array
      this.fetchCountryData(this.countryToAdd);

      // Tvinga Angular att se arrayen som "changed"
      this.compareCountries = [...this.compareCountries];
      console.log('compareCountries after spread:', this.compareCountries);
      this.countryToAdd = null;
    }
  }

  fetchCountryData(country: countriesData): void {
    this.covidApiService.getSingleCountry(country.iso).subscribe(
      (response) => {
        const countryData = {
          name: country.name,
          value: response.data.confirmed
        };
        this.compareCountries.push(countryData);

        // Gör om för att trigga change detection
        this.compareCountries = [...this.compareCountries];
        console.log('compareCountries after fetch:', this.compareCountries);

      },
      (error) => {
        console.error('Error fetching country data', error);
      }
    );
  }

  // Angular använder "referenser" för att upptäcka förändringar.
  // Att helt enkelt modifiera en array (som push) skapar inte en ny referens,
  // så Angular kanske inte inser att data har ändrats. Men med
  // this.compareCountries = [...this.compareCountries];
  // ser Angular en "ny" array, som utlöser förändringsdetektering,
  // vilket hjälper VerticalBarChartComponent att ta emot uppdaterad data.



}
