import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentChildHostMapComponent } from './parent-child-host-map.component';

describe('TemplateDiffComponent', () => {
    let component: ParentChildHostMapComponent;
    let fixture: ComponentFixture<ParentChildHostMapComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ParentChildHostMapComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ParentChildHostMapComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
