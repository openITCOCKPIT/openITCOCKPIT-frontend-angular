import { TestBed } from '@angular/core/testing';

import { GrafanaEditorService } from './grafana-editor.service';

describe('GrafanaEditorService', () => {
  let service: GrafanaEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrafanaEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
