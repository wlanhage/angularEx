import { Component, OnInit } from '@angular/core';
import { CovidapiService } from '../../services/covidapi.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VerticalBarChartComponent } from '../../components/vertical-bar-chart/vertical-bar-chart.component';
import { StackedAreaChartComponent } from "../../components/stacked-area-chart/stacked-area-chart.component";
import { HomebuttonComponent } from '../../components/homebutton/homebutton.component';
import { MaterialModule } from '../../material.module';
import { countriesData } from '../../models/countries-data';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, VerticalBarChartComponent, StackedAreaChartComponent, HomebuttonComponent, MaterialModule],
  providers: [],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', /* '../../styleElements/styleElements.scss' */]
})
export class DashboardComponent implements OnInit {
  constructor(
    private covidApiService: CovidapiService,
    private router: Router,
  ) {}

  navigateToCompare(): void {
    this.router.navigate(['/compare'])
  }


  countries: any[] = [];
  singleCountry: any;
  selectedCountry: any;
  selectedDate: any;
  provincesFromCountry: any[] = [];
  componentData: any[] = [];
  showVerticalBarChart: boolean = false;
  showStackedAreaChart: boolean = false;
  countriesLoop: countriesData[] = [];

  ngOnInit(): void {
    this.fetchCountries();
  }

  fetchCountries(): void {
    this.covidApiService.getCountries().subscribe(
      (response) => {
        this.countries = response.data;
        this.countriesLoop = [...this.countries];
        console.log(this.countries);
      },
      (error) => {
        console.error('Error fetching countries', error);
      }
    );
  }

  getSingleCountry(): void {
    if (this.selectedCountry && this.selectedCountry.iso) {
      this.covidApiService.getSingleCountry(this.selectedCountry.iso, this.selectedDate).subscribe(
        (response) => {
          this.singleCountry = response.data;
          console.log(this.singleCountry);
        },
        (error) => {
          console.error('Error fetching country', error);
        }
      );
    }
  }

  getProvincesFromCountry(): void {
    if (this.selectedCountry && this.selectedCountry.iso) {
      this.covidApiService.getProvincesFromCountry(this.selectedCountry.iso, this.selectedDate).subscribe(
        (response) => {
          this.provincesFromCountry = response.data;
          console.log('Provinces: ', this.provincesFromCountry);
        },
        (error) => {
          console.error('Error fetching country', error);
        }
      );
    }
  }

}
