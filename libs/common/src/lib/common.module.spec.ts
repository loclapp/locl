import { async, TestBed } from '@angular/core/testing';
import { LoclCommonModule } from './common.module';

describe('CommonModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [LoclCommonModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(LoclCommonModule).toBeDefined();
  });
});
