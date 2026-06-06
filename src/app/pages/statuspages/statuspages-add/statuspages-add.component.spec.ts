import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatuspagesAddComponent } from './statuspages-add.component';

describe('StatuspagesAddComponent', () => {
    let component: StatuspagesAddComponent;
    let fixture: ComponentFixture<StatuspagesAddComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StatuspagesAddComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(StatuspagesAddComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
