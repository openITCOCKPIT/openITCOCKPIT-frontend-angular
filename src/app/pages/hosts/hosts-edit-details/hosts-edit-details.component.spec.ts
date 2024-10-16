import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostsEditDetailsComponent } from './hosts-edit-details.component';

describe('HostsEditDetailsComponent', () => {
    let component: HostsEditDetailsComponent;
    let fixture: ComponentFixture<HostsEditDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostsEditDetailsComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostsEditDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
