import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvcTreeComponent } from './evc-tree.component';

describe('EvcTreeComponent', () => {
    let component: EvcTreeComponent;
    let fixture: ComponentFixture<EvcTreeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EvcTreeComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(EvcTreeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
