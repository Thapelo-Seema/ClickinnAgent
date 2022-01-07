import { TestBed } from '@angular/core/testing';

import { IonicComponentService } from './ionic-component.service';

describe('IonicComponentService', () => {
  let service: IonicComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IonicComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
