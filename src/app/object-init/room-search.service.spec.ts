import { TestBed } from '@angular/core/testing';

import { RoomSearchService } from './room-search.service';

describe('RoomSearchService', () => {
  let service: RoomSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
