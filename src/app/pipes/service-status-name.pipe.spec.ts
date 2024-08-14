import { ServiceStatusNamePipe } from './service-status-name.pipe';

describe('ServiceStatusNamePipe', () => {
  it('create an instance', () => {
    const pipe = new ServiceStatusNamePipe();
    expect(pipe).toBeTruthy();
  });
});
