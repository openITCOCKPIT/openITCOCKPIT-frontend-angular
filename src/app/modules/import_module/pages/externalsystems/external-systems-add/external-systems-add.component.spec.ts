import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalSystemsAddComponent } from './external-systems-add.component';

describe('ExternalSystemsAddComponent', () => {
    let component: ExternalSystemsAddComponent;
    let fixture: ComponentFixture<ExternalSystemsAddComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ExternalSystemsAddComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ExternalSystemsAddComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
