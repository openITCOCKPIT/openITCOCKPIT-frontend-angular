import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorsDebugComponent } from './administrators-debug.component';

describe('AdministratorsDebugComponent', () => {
    let component: AdministratorsDebugComponent;
    let fixture: ComponentFixture<AdministratorsDebugComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AdministratorsDebugComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AdministratorsDebugComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
