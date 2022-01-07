import { TestBed } from '@angular/core/testing';

import { ObjectInitService } from './object-init.service';

describe('ObjectInitService', () => {
  let service: ObjectInitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjectInitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
