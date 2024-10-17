import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicegroupsCopyComponent } from './servicegroups-copy.component';

describe('ServicegroupsCopyComponent', () => {
    let component: ServicegroupsCopyComponent;
    let fixture: ComponentFixture<ServicegroupsCopyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServicegroupsCopyComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ServicegroupsCopyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
