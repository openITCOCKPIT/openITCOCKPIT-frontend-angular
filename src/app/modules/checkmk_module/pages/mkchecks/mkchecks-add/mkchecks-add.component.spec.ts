import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MkchecksAddComponent } from './mkchecks-add.component';

describe('MkchecksAddComponent', () => {
    let component: MkchecksAddComponent;
    let fixture: ComponentFixture<MkchecksAddComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MkchecksAddComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MkchecksAddComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
