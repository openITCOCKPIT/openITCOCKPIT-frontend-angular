import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateDiffComponent } from './template-diff.component';

describe('TemplateDiffComponent', () => {
    let component: TemplateDiffComponent;
    let fixture: ComponentFixture<TemplateDiffComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TemplateDiffComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TemplateDiffComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
