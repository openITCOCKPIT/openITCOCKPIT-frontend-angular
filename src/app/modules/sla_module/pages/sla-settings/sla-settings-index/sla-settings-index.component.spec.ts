import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaSettingsIndexComponent } from './sla-settings-index.component';

describe('SlasAddComponent', () => {
    let component: SlaSettingsIndexComponent;
    let fixture: ComponentFixture<SlaSettingsIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SlaSettingsIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SlaSettingsIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
