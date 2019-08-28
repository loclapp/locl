import { async, TestBed } from '@angular/core/testing';
import { CliModule } from './cli.module';

describe('CliModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CliModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(CliModule).toBeDefined();
  });
});
