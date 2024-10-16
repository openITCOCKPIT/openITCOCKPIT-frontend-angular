import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantreportsAddComponent } from './instantreports-add.component';

describe('InstantreportsAddComponent', () => {
    let component: InstantreportsAddComponent;
    let fixture: ComponentFixture<InstantreportsAddComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [InstantreportsAddComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(InstantreportsAddComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
