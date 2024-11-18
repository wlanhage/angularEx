import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CovidapiService } from '../../services/covidapi.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { countriesData } from '../../models/countries-data';
import { MaterialModule } from '../../material.module';
import { StackedAreaChartComponent } from '../../components/stacked-area-chart/stacked-area-chart.component';
import { VerticalBarChartComponent } from "../../components/vertical-bar-chart/vertical-bar-chart.component";
import { TableComponentComponent } from '../../components/table-component/table-component.component';
import { HomebuttonComponent } from '../../components/homebutton/homebutton.component';
import { HelperService } from '../../services/helper/helper.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';



@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [CommonModule, FormsModule, StackedAreaChartComponent, VerticalBarChartComponent, TableComponentComponent, HomebuttonComponent, MaterialModule, NavbarComponent],
  providers: [],
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss', /* '../../styleElements/styleElements.scss' */]
})
export class CompareComponent implements OnInit {
  countries: countriesData[] = [];
  selectedCountries: countriesData[] = [];
  countryToAdd: countriesData | null = null;
  showVerticalBarChart: boolean = false;
  showStackedAreaChart: boolean = false;
  countriesLoop: countriesData[] = [];

  selectedDataType: string = 'confirmed';


  constructor(
    private covidApiService: CovidapiService,
    private helperService: HelperService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.fetchCountries();
    const state = this.location.getState() as { [key: string]: any };
    if (state && state['selectedCountry']) {
      this.selectedCountries.push(state['selectedCountry'])
    }

  }

  fetchCountries(): void {
    this.covidApiService.getCountries().subscribe(
      (response) => {
        this.countries = response.data;
        this.countriesLoop = [...this.countries];
      },
      (error) => {
        console.error('Error fetching countries', error);
      }
    );
  }

  addCountry(): void {
    try {
    if (this.countryToAdd && !this.selectedCountries.some(country => country.iso === this.countryToAdd?.iso)) {
      this.fetchCountryData(this.countryToAdd);
      this.helperService.showSuccess('Insert successfull')
      this.countryToAdd = null;
      }
      else if (this.countryToAdd && this.selectedCountries.some(country => country.iso === this.countryToAdd?.iso)) {
        this.helperService.showError('Duplicate country')
      }
      else if (this.countryToAdd === null) {
        this.helperService.showError('Need to select a country!')
      }
    }
    catch (error) {
      this.helperService.showError('Error occured when trying to add country')
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

  // Angular använder "referenser" för att upptäcka förändringar.
  // Att helt enkelt modifiera en array (som push) skapar inte en ny referens,
  // så Angular kanske inte inser att data har ändrats. Men med
  // this.compareCountries = [...this.compareCountries];
  // ser Angular en "ny" array, som utlöser förändringsdetektering,
  // vilket hjälper VerticalBarChartComponent att ta emot uppdaterad data.

}





