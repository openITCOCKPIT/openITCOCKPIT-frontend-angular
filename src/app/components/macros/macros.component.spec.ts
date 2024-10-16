import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MacrosComponent } from './macros.component';

describe('MacrosComponentComponent', () => {
    let component: MacrosComponent;
    let fixture: ComponentFixture<MacrosComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MacrosComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MacrosComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
