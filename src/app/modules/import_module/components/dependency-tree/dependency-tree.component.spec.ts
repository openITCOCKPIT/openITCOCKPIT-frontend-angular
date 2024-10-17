import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DependencyTreeComponent } from './dependency-tree.component';

describe('DependencyTreeComponent', () => {
    let component: DependencyTreeComponent;
    let fixture: ComponentFixture<DependencyTreeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DependencyTreeComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DependencyTreeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
