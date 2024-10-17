import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotUsedByObjectComponent } from './not-used-by-object.component';

describe('NotUsedByObjectComponent', () => {
    let component: NotUsedByObjectComponent;
    let fixture: ComponentFixture<NotUsedByObjectComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NotUsedByObjectComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(NotUsedByObjectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
