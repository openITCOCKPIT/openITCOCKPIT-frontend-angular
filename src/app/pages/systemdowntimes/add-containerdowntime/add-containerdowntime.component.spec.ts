import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContainerdowntimeComponent } from './add-containerdowntime.component';

describe('AddContainerdowntimeComponent', () => {
    let component: AddContainerdowntimeComponent;
    let fixture: ComponentFixture<AddContainerdowntimeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AddContainerdowntimeComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AddContainerdowntimeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
