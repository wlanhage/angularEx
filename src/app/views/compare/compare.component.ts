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
  styleUrls: ['./compare.component.scss', '../../styleElements/styleElements.scss']
})
export class CompareComponent implements OnInit {
  countries: countriesData[] = [];
  selectedCountries: any[] = [];
  countryToAdd: countriesData | null = null;
  showVerticalBarChart: boolean = false;
  showStackedAreaChart: boolean = false;

  constructor(private covidApiService: CovidapiService) {}

  ngOnInit(): void {
    this.fetchCountries();
    console.log('Selected countries:', this.selectedCountries);
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
    if (this.countryToAdd && !this.selectedCountries.some(country => country.iso === this.countryToAdd?.iso)) {
      this.fetchCountryData(this.countryToAdd);
      this.countryToAdd = null;
    }
  }

  fetchCountryData(country: countriesData): void {
    this.covidApiService.getSingleCountry(country.iso).subscribe(
      (response) => {
        const countryData = {
          ...country,
          confirmed: response.data.confirmed,
          deaths: response.data.deaths
        };
        this.selectedCountries.push(countryData);
        this.selectedCountries = [...this.selectedCountries];
        console.log('selectedCountries after fetch:', this.selectedCountries);
      },
      (error) => {
        console.error('Error fetching country data', error);
      }
    );
  }
}
  // Angular använder "referenser" för att upptäcka förändringar.
  // Att helt enkelt modifiera en array (som push) skapar inte en ny referens,
  // så Angular kanske inte inser att data har ändrats. Men med
  // this.compareCountries = [...this.compareCountries];
  // ser Angular en "ny" array, som utlöser förändringsdetektering,
  // vilket hjälper VerticalBarChartComponent att ta emot uppdaterad data.




