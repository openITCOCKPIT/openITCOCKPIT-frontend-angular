import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostgroupsCopyComponent } from './hostgroups-copy.component';

describe('HostgroupsCopyComponent', () => {
    let component: HostgroupsCopyComponent;
    let fixture: ComponentFixture<HostgroupsCopyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostgroupsCopyComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostgroupsCopyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
