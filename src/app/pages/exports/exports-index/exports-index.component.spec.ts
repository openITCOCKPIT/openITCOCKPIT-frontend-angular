import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportsIndexComponent } from './exports-index.component';

describe('ExportsIndexComponent', () => {
    let component: ExportsIndexComponent;
    let fixture: ComponentFixture<ExportsIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ExportsIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ExportsIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
