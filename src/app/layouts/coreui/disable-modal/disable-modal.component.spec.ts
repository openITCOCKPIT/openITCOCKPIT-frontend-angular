import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisableModalComponent } from './disable-modal.component';

describe('DisableModalComponent', () => {
    let component: DisableModalComponent;
    let fixture: ComponentFixture<DisableModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DisableModalComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DisableModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
