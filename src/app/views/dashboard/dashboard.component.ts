import { Component, OnInit } from '@angular/core';
import { CovidapiService } from '../../services/covidapi.service';
import { CommonModule } from '@angular/common';
import { response } from 'express';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  countries: any[] = [];
  singleCountry: any;
  selectedCountry: any;

  constructor(private covidApiService: CovidapiService) {}

  ngOnInit(): void {
    this.fetchCountries();
    this.getSingleCountry();
  }

  fetchCountries(): void {
    this.covidApiService.getCountries().subscribe(
      (response) => {
        this.countries = response.data;
        console.log(this.countries);
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
          console.log(this.singleCountry);
        },
        (error) => {
          console.error('Error fetching country', error);
        }
    )
  }
}
}
