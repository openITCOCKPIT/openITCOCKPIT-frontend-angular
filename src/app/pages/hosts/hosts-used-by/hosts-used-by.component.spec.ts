import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostsUsedByComponent } from './hosts-used-by.component';

describe('HostsUsedByComponent', () => {
    let component: HostsUsedByComponent;
    let fixture: ComponentFixture<HostsUsedByComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostsUsedByComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostsUsedByComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
