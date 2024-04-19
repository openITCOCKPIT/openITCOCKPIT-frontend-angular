import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollIndexComponent } from './scroll-index.component';

describe('ScrollIndexComponent', () => {
    let component: ScrollIndexComponent;
    let fixture: ComponentFixture<ScrollIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ScrollIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ScrollIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
