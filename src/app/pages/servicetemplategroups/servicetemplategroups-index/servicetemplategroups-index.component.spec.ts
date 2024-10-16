import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicetemplategroupsIndexComponent } from './servicetemplategroups-index.component';

describe('ServicetemplategroupsIndexComponent', () => {
    let component: ServicetemplategroupsIndexComponent;
    let fixture: ComponentFixture<ServicetemplategroupsIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServicetemplategroupsIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ServicetemplategroupsIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
