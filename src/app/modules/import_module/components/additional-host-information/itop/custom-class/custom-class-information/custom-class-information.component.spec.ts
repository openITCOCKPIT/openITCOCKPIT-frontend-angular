import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomClassInformationComponent } from './custom-class-information.component';

describe('CustomClassInformationComponent', () => {
    let component: CustomClassInformationComponent;
    let fixture: ComponentFixture<CustomClassInformationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CustomClassInformationComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CustomClassInformationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
