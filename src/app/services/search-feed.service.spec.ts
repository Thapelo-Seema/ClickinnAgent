import { TestBed } from '@angular/core/testing';

import { SearchFeedService } from './search-feed.service';

describe('SearchFeedService', () => {
  let service: SearchFeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchFeedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
