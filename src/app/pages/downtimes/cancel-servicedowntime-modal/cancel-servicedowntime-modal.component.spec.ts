import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelServicedowntimeModalComponent } from './cancel-servicedowntime-modal.component';

describe('DeleteAllComponent', () => {
    let component: CancelServicedowntimeModalComponent;
    let fixture: ComponentFixture<CancelServicedowntimeModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CancelServicedowntimeModalComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CancelServicedowntimeModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
