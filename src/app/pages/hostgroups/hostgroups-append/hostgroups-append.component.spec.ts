import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostgroupsAppendComponent } from './hostgroups-append.component';

describe('HostgroupsAppendComponent', () => {
    let component: HostgroupsAppendComponent;
    let fixture: ComponentFixture<HostgroupsAppendComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostgroupsAppendComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostgroupsAppendComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
