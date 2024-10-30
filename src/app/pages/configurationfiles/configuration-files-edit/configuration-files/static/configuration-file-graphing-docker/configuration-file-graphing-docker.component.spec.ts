import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationFileGraphingDockerComponent } from './configuration-file-graphing-docker.component';

describe('ConfigurationFileGraphingDockerComponent', () => {
  let component: ConfigurationFileGraphingDockerComponent;
  let fixture: ComponentFixture<ConfigurationFileGraphingDockerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurationFileGraphingDockerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationFileGraphingDockerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
