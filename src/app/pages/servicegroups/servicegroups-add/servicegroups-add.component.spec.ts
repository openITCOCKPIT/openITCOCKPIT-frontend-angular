import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicegroupsAddComponent } from './servicegroups-add.component';

describe('ServicegroupsAddComponent', () => {
    let component: ServicegroupsAddComponent;
    let fixture: ComponentFixture<ServicegroupsAddComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServicegroupsAddComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ServicegroupsAddComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
