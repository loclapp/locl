import { CoreModule } from './core.module';

describe('LoclCoreModule', () => {
  it('should work', () => {
    expect(new CoreModule(null)).toBeDefined();
  });
});
