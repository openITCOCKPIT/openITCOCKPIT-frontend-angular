import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicetemplatesIndexComponent } from './servicetemplates-index.component';

describe('ServicetemplatesIndexComponent', () => {
    let component: ServicetemplatesIndexComponent;
    let fixture: ComponentFixture<ServicetemplatesIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServicetemplatesIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ServicetemplatesIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
