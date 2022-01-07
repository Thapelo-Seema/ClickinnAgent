import { TestBed } from '@angular/core/testing';

import { LocationGraphService } from './location-graph.service';

describe('LocationGraphService', () => {
  let service: LocationGraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationGraphService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
