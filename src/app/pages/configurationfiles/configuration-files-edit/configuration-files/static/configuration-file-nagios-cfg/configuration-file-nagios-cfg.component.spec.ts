import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationFileNagiosCfgComponent } from './configuration-file-nagios-cfg.component';

describe('ConfigurationFileNagiosCfgComponent', () => {
    let component: ConfigurationFileNagiosCfgComponent;
    let fixture: ComponentFixture<ConfigurationFileNagiosCfgComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConfigurationFileNagiosCfgComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ConfigurationFileNagiosCfgComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
