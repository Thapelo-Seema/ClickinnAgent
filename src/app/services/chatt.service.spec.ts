import { TestBed } from '@angular/core/testing';

import { ChattService } from './chatt.service';

describe('ChattService', () => {
  let service: ChattService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChattService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
