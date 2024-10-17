import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicetemplatesAddComponent } from './servicetemplates-add.component';

describe('ServicetemplatesAddComponent', () => {
    let component: ServicetemplatesAddComponent;
    let fixture: ComponentFixture<ServicetemplatesAddComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServicetemplatesAddComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ServicetemplatesAddComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
