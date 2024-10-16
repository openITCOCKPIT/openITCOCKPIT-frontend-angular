import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCopyComponent } from './input-copy.component';

describe('InputCopyComponent', () => {
    let component: InputCopyComponent;
    let fixture: ComponentFixture<InputCopyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [InputCopyComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(InputCopyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
