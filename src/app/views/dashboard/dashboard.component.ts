import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CovidapiService } from '../../services/covidapi.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VerticalBarChartComponent } from '../../components/vertical-bar-chart/vertical-bar-chart.component';
import { StackedAreaChartComponent } from "../../components/stacked-area-chart/stacked-area-chart.component";
import { HomebuttonComponent } from '../../components/homebutton/homebutton.component';
import { MaterialModule } from '../../material.module';
import { countriesData } from '../../models/countries-data';
import { response } from 'express';
import { HelperService } from '../../services/helper/helper.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, VerticalBarChartComponent, StackedAreaChartComponent, HomebuttonComponent, MaterialModule],
  providers: [DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', /* '../../styleElements/styleElements.scss' */]
})
export class DashboardComponent implements OnInit {
  constructor(
    private covidApiService: CovidapiService,
    private router: Router,
    private datePipe: DatePipe,
    private helperService: HelperService,
  ) {}

  countries: any[] = [];
  singleCountry: any;
  selectedCountry: any;
  selectedDate: any;
  provincesFromCountry: any[] = [];
  componentData: any[] = [];
  countriesLoop: countriesData[] = [];

  ngOnInit(): void {
    this.fetchCountries();
  }

  navigateToCompare(): void {
    this.getSingleCountry();
    console.log('Navigating to compare with selectedCountry:', this.selectedCountry);
    this.router.navigate(['/compare'], { state: { selectedCountry: this.selectedCountry }})
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

  getSingleCountry(): void {
    if (this.selectedCountry && this.selectedCountry.iso) {
      this.covidApiService.getSingleCountry(this.selectedCountry.iso).subscribe(
        (response) => {
          this.singleCountry = response.data;
          this.selectedCountry = { ...this.selectedCountry, ...response.data }; // Mergea datan för att skicka med confirmed och deaths till compare
          console.log(this.singleCountry);
        },
        (error) => {
          console.error('Error fetching country', error);
        }
      );
    }
  }

  getSingleCountryWithDate(): void {
    if (this.selectedCountry && this.selectedCountry.iso && this.selectedDate) {
      const formattedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
      if (formattedDate) {
      this.covidApiService.getSingleCountryWithDate(this.selectedCountry.iso, formattedDate).subscribe(
        (response) => {
          this.singleCountry = response.data;
          console.log(this.singleCountry);
          this.helperService.showSuccess('Data until {{formattedDate}} successfully fetched')
        },
        (error) => {
          console.error('Error fetching country with date', error);
        }
      );
    } else {
      this.helperService.showError('Error fetching date')
    }
    }
  }

  getProvincesFromCountry(): void {
    if (this.selectedCountry && this.selectedCountry.iso) {
      this.covidApiService.getProvincesFromCountry(this.selectedCountry.iso).subscribe(
        (response) => {
          this.provincesFromCountry = response;
          console.log('Provinces: ', this.provincesFromCountry);
        },
        (error) => {
          console.error('Error fetching country', error);
        }
      );
    }
  }

}
