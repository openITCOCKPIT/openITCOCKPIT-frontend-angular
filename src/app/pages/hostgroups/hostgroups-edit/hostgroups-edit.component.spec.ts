import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostgroupsEditComponent } from './hostgroups-edit.component';

describe('HostgroupsEditComponent', () => {
    let component: HostgroupsEditComponent;
    let fixture: ComponentFixture<HostgroupsEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostgroupsEditComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostgroupsEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
