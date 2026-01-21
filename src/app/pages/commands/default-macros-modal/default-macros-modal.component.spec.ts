import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultMacrosModalComponent } from './default-macros-modal.component';

describe('DefaultMacrosModalComponent', () => {
    let component: DefaultMacrosModalComponent;
    let fixture: ComponentFixture<DefaultMacrosModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DefaultMacrosModalComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DefaultMacrosModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
