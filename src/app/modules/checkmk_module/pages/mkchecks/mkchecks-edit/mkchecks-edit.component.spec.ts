import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MkchecksEditComponent } from './mkchecks-edit.component';

describe('MkchecksEditComponent', () => {
    let component: MkchecksEditComponent;
    let fixture: ComponentFixture<MkchecksEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MkchecksEditComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MkchecksEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
