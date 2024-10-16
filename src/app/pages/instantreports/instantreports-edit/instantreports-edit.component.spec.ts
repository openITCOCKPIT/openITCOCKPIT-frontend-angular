import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantreportsEditComponent } from './instantreports-edit.component';

describe('InstantreportsEditComponent', () => {
    let component: InstantreportsEditComponent;
    let fixture: ComponentFixture<InstantreportsEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [InstantreportsEditComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(InstantreportsEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
