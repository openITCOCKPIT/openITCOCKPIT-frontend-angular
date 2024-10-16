import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostsSharingComponent } from './hosts-sharing.component';

describe('HostsSharingComponent', () => {
    let component: HostsSharingComponent;
    let fixture: ComponentFixture<HostsSharingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostsSharingComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostsSharingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
