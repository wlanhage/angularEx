import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumbersCardChartComponent } from './numbers-card-chart.component';

describe('NumbersCardChartComponent', () => {
  let component: NumbersCardChartComponent;
  let fixture: ComponentFixture<NumbersCardChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumbersCardChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumbersCardChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
