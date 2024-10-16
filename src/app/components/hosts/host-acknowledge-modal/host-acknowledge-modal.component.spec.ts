import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostAcknowledgeModalComponent } from './host-acknowledge-modal.component';

describe('HostAcknowledgeModalComponent', () => {
    let component: HostAcknowledgeModalComponent;
    let fixture: ComponentFixture<HostAcknowledgeModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostAcknowledgeModalComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostAcknowledgeModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
