import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MattermostSettingsIndexComponent } from './mattermost-settings-index.component';

describe('MattermostSettingsIndexComponent', () => {
    let component: MattermostSettingsIndexComponent;
    let fixture: ComponentFixture<MattermostSettingsIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MattermostSettingsIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MattermostSettingsIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
