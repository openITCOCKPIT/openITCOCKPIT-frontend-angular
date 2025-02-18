import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceOutputItemComponent } from './service-output-item.component';

describe('ServiceOutputItemComponent', () => {
    let component: ServiceOutputItemComponent;
    let fixture: ComponentFixture<ServiceOutputItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServiceOutputItemComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ServiceOutputItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
