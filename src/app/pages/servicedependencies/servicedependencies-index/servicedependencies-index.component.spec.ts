import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicedependenciesIndexComponent } from './servicedependencies-index.component';

describe('ServicedependenciesIndexComponent', () => {
    let component: ServicedependenciesIndexComponent;
    let fixture: ComponentFixture<ServicedependenciesIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServicedependenciesIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ServicedependenciesIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
