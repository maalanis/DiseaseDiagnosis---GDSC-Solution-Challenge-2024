import { TestBed } from '@angular/core/testing';

import { DiseaseDiagnosticService } from './disease-diagnostic.service';

describe('DiseaseDiagnosticService', () => {
  let service: DiseaseDiagnosticService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiseaseDiagnosticService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
