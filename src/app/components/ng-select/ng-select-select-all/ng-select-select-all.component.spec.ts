import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgSelectSelectAllComponent } from './ng-select-select-all.component'

describe('NgSelectSelectAllComponent', () => {
    let component: NgSelectSelectAllComponent;
    let fixture: ComponentFixture<NgSelectSelectAllComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NgSelectSelectAllComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(NgSelectSelectAllComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
