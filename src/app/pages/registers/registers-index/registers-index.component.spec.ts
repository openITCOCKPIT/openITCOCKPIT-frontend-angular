import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistersIndexComponent } from './registers-index.component';

describe('RegistersIndexComponent', () => {
    let component: RegistersIndexComponent;
    let fixture: ComponentFixture<RegistersIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RegistersIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(RegistersIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
