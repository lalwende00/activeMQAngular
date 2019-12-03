import { TestBed } from '@angular/core/testing';

import { ActiveMqService } from './active-mq.service';

describe('ActiveMqService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActiveMqService = TestBed.get(ActiveMqService);
    expect(service).toBeTruthy();
  });
});
