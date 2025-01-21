import { TestBed } from '@angular/core/testing';

import { DashMapServiceService } from './dash-map-service.service';

describe('DashMapServiceService', () => {
  let service: DashMapServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashMapServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
