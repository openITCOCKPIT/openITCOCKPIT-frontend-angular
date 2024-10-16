import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicetemplatesCopyComponent } from './servicetemplates-copy.component';

describe('ServicetemplatesCopyComponent', () => {
    let component: ServicetemplatesCopyComponent;
    let fixture: ComponentFixture<ServicetemplatesCopyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServicetemplatesCopyComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ServicetemplatesCopyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
