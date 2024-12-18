import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { CovidapiService } from '../../services/covidapi.service';
import { CommonModule } from '@angular/common';
import { countriesData } from '../../models/countries-data';

@Component({
  selector: 'app-table-component',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './table-component.component.html',
  styleUrl: './table-component.component.scss'
})
export class TableComponentComponent {
  ngOnInit(): void {

    this.getDeathRate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCountries']) {
      this.getDeathRate();
    }
  }

  @Input() selectedCountries: any[] = [];
  displayedColumns: string[] = ['position', 'name', 'confirmed', 'deaths', 'death-rate'];

  getDeathRate(): void {
    this.selectedCountries.forEach(country => {
      if (country.deaths && country.confirmed) {
      country.deathRate = (country.deaths / country.confirmed);
     } else {
      country.deathRate = 'No data'
     }
   })
  }

}
