import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationFileNstaMasterComponent } from './configuration-file-nsta-master.component';

describe('ConfigurationFileNstaMasterComponent', () => {
    let component: ConfigurationFileNstaMasterComponent;
    let fixture: ComponentFixture<ConfigurationFileNstaMasterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConfigurationFileNstaMasterComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ConfigurationFileNstaMasterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
