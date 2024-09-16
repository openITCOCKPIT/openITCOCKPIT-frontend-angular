import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlasEditComponent } from './slas-edit.component';

describe('SlasEditComponent', () => {
    let component: SlasEditComponent;
    let fixture: ComponentFixture<SlasEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SlasEditComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SlasEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
