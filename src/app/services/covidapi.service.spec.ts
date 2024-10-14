import { TestBed } from '@angular/core/testing';

import { CovidapiService } from './covidapi.service';

describe('CovidapiService', () => {
  let service: CovidapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CovidapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
