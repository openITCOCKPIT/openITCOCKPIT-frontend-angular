import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsarFlowSettingsIndexComponent } from './isar-flow-settings-index.component';

describe('IsarFlowSettingsIndexComponent', () => {
    let component: IsarFlowSettingsIndexComponent;
    let fixture: ComponentFixture<IsarFlowSettingsIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [IsarFlowSettingsIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(IsarFlowSettingsIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
