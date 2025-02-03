import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TachoItemComponent } from './tacho-item.component';

describe('TachoItemComponent', () => {
    let component: TachoItemComponent;
    let fixture: ComponentFixture<TachoItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TachoItemComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TachoItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
