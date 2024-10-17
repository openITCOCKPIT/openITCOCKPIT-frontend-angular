import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantreportsIndexComponent } from './instantreports-index.component';

describe('InstantreportsIndexComponent', () => {
    let component: InstantreportsIndexComponent;
    let fixture: ComponentFixture<InstantreportsIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [InstantreportsIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(InstantreportsIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
