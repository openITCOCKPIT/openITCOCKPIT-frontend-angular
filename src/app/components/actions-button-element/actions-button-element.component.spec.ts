import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsButtonElementComponent } from './actions-button-element.component';

describe('ActionsButtonElementComponent', () => {
    let component: ActionsButtonElementComponent;
    let fixture: ComponentFixture<ActionsButtonElementComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ActionsButtonElementComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ActionsButtonElementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
