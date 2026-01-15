import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenstreetmapSettingsComponent } from './openstreetmap-settings.component';

describe('OpenstreetmapSettingsComponent', () => {
    let component: OpenstreetmapSettingsComponent;
    let fixture: ComponentFixture<OpenstreetmapSettingsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [OpenstreetmapSettingsComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(OpenstreetmapSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
