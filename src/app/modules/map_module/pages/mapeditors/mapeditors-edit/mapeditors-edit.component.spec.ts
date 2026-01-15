import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapeditorsEditComponent } from './mapeditors-edit.component';

describe('MapeditorsEditComponent', () => {
    let component: MapeditorsEditComponent;
    let fixture: ComponentFixture<MapeditorsEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MapeditorsEditComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MapeditorsEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
