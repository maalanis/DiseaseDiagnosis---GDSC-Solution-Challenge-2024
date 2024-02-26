import { TestBed } from '@angular/core/testing';

import { DiseaseInfoService } from './disease-info.service';

describe('DiseaseInfoService', () => {
  let service: DiseaseInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiseaseInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
