import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JiraSettingsIndexComponent } from './jira-settings-index.component';

describe('JiraSettingsIndexComponent', () => {
    let component: JiraSettingsIndexComponent;
    let fixture: ComponentFixture<JiraSettingsIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [JiraSettingsIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(JiraSettingsIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
