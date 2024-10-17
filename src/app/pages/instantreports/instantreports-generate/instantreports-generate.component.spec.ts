import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantreportsGenerateComponent } from './instantreports-generate.component';

describe('InstantreportsGenerateComponent', () => {
    let component: InstantreportsGenerateComponent;
    let fixture: ComponentFixture<InstantreportsGenerateComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [InstantreportsGenerateComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(InstantreportsGenerateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
