import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomClassComponent } from './custom-class.component';

describe('CustomClassComponent', () => {
    let component: CustomClassComponent;
    let fixture: ComponentFixture<CustomClassComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CustomClassComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CustomClassComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
