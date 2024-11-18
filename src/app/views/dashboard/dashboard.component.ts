import { Component, OnInit, ChangeDetectorRef, OnChanges, SimpleChanges, HostListener,  } from '@angular/core';
import { CovidapiService } from '../../services/covidapi.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VerticalBarChartComponent } from '../../components/vertical-bar-chart/vertical-bar-chart.component';
import { StackedAreaChartComponent } from "../../components/stacked-area-chart/stacked-area-chart.component";
import { PieGridComponent } from '../../components/pie-grid/pie-grid.component'
import { HomebuttonComponent } from '../../components/homebutton/homebutton.component';
import { MaterialModule } from '../../material.module';
import { countriesData } from '../../models/countries-data';
import { response } from 'express';
import { HelperService } from '../../services/helper/helper.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, VerticalBarChartComponent, StackedAreaChartComponent, PieGridComponent, HomebuttonComponent, MaterialModule, NavbarComponent],
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

  isAsideOpen = false;

  countries: any[] = [];
  singleCountry: any;
  selectedCountry: any;
  selectedDate: any;

  componentData: any[] = [];
  countriesLoop: countriesData[] = [];
  countryData: any;

  provinceData: any[] = [];
  selectedProvinceAmount: number = 8;
  provinceConfirmedData: any[] = [];
  provinceDeathsData: any[] = [];
  selectedDataType: string = 'confirmed';

  showProvinces = false;

  displayedColumns: string[] = ['position', 'name', 'confirmed', 'deaths', 'fatality rate'];

  ngOnInit(): void {
    this.fetchCountries();
    this.checkWindowSize();
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.countryData = navigation.extras.state['countryData'];
      console.log('Received country data from home:', this.countryData);
      if (this.countryData) {
        this.selectedCountry = this.countryData;
        this.getSingleCountry();
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCountry'] && !changes['selectedCountry'].firstChange) {
      this.getProvinceData();
    }
  }

  navigateToCompare(): void {
    this.getSingleCountry();
    console.log('Navigating to compare with selectedCountry:', this.selectedCountry);
    this.router.navigate(['/compare'], { state: { selectedCountry: this.selectedCountry }})
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkWindowSize();
  }

  checkWindowSize(): void {
    if (typeof window !== 'undefined' && window.innerWidth > 1000) {
      this.isAsideOpen = true;
      console.log('over 1000');
    } else {
      this.isAsideOpen = false;
    }
  }

  handleAsideToggle(isOpen: boolean): void {
    this.isAsideOpen = isOpen;
  }


  toggleProvinces () {
    this.showProvinces = !this.showProvinces;
    if (this.showProvinces) {
      this.getProvinceData();
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
          const recovered = ((response.data.recovered ?? 0) - (response.data.deaths ?? 0)) || 0;
          this.singleCountry = { ...response.data, recovered };
          console.log(this.singleCountry);
          this.helperService.showSuccess('Data until date successfully fetched');
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

  getProvinceData(provinceAmount?: number): void {
    const amount = provinceAmount || this.selectedProvinceAmount;
    if (this.selectedCountry && this.selectedCountry.iso) {
      this.covidApiService.getProvinceData(this.selectedCountry.iso).subscribe(
        (response) => {
          const sortedConfirmedProvinces = response.data.sort((a: any, b: any) => b.confirmed - a.confirmed);
        this.provinceConfirmedData = sortedConfirmedProvinces.slice(0, amount);

        const sortedDeathsProvinces = response.data.sort((a: any, b: any) => b.deaths - a.deaths);
        this.provinceDeathsData = sortedDeathsProvinces.slice(0, amount);

        // Initiera data
        this.provinceData = this.provinceConfirmedData;

        },
        (error) => {
          console.error('Error fetching provinces data', error);
        }
      );
    } else {
      console.error('No country selected');
    }
  }

  updateProvinceData(): void {
    if (this.selectedDataType === 'confirmed') {
      this.provinceData = this.provinceConfirmedData;
    } else if (this.selectedDataType === 'deaths') {
      this.provinceData = this.provinceDeathsData;
    }
  }



}
