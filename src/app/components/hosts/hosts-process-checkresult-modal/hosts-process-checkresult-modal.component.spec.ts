import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostsProcessCheckresultModalComponent } from './hosts-process-checkresult-modal.component';

describe('HostsProcessCheckresultModalComponent', () => {
    let component: HostsProcessCheckresultModalComponent;
    let fixture: ComponentFixture<HostsProcessCheckresultModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostsProcessCheckresultModalComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostsProcessCheckresultModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
