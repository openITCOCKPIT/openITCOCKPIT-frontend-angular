import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeOutlineComponent } from './badge-outline.component';

describe('BadgeOutlineComponent', () => {
    let component: BadgeOutlineComponent;
    let fixture: ComponentFixture<BadgeOutlineComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BadgeOutlineComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(BadgeOutlineComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
