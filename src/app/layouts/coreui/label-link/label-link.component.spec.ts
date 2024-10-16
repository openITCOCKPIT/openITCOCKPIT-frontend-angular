import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelLinkComponent } from './label-link.component';

describe('LabelLinkComponent', () => {
    let component: LabelLinkComponent;
    let fixture: ComponentFixture<LabelLinkComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LabelLinkComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(LabelLinkComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
