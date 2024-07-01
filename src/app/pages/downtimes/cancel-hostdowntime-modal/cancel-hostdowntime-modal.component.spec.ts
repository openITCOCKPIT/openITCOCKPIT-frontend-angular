import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelHostdowntimeModalComponent } from './cancel-hostdowntime-modal.component';

describe('DeleteAllComponent', () => {
    let component: CancelHostdowntimeModalComponent;
    let fixture: ComponentFixture<CancelHostdowntimeModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CancelHostdowntimeModalComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CancelHostdowntimeModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
