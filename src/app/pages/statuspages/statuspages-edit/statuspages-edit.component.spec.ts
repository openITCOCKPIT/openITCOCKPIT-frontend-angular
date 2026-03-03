import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatuspagesEditComponent } from './statuspages-edit.component';

describe('StatuspagesEditComponent', () => {
    let component: StatuspagesEditComponent;
    let fixture: ComponentFixture<StatuspagesEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StatuspagesEditComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(StatuspagesEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
