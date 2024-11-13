import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CovidapiService } from '../../services/covidapi.service';
import { Color, ScaleType, NgxChartsModule } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
  selector: 'app-pie-grid',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './pie-grid.component.html',
  styleUrl: './pie-grid.component.scss'
})
export class PieGridComponent {
  @Input() provinceData: any[] = [];
  @Input() selectedDataType: string = 'confirmed';
  single: any[] = [];
  view: [number, number] = [1050, 400];

  // options
  showLegend: boolean = true;
  showLabels: boolean = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['provinceData']) {
      this.updateChartData();
    }
  }

  updateChartData(): void {
    this.single = this.provinceData.map(province => ({
      name: province.region.province,
      value: this.selectedDataType === 'confirmed' ? province.confirmed : province.deaths
    }));
    console.log('single log', this.single)
  }

  onSelect(event: any): void {
    console.log(event);
  }

}
