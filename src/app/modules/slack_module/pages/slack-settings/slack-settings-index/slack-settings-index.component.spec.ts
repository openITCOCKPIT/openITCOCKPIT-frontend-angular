import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlackSettingsIndexComponent } from './slack-settings-index.component';

describe('SlackSettingsIndexComponent', () => {
    let component: SlackSettingsIndexComponent;
    let fixture: ComponentFixture<SlackSettingsIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SlackSettingsIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SlackSettingsIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
