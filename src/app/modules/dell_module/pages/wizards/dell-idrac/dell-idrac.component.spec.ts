import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DellIdracComponent } from './dell-idrac.component';

describe('DellIdracComponent', () => {
    let component: DellIdracComponent;
    let fixture: ComponentFixture<DellIdracComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DellIdracComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DellIdracComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
