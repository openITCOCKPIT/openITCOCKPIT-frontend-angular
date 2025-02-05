import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphItemComponent } from './graph-item.component';

describe('GraphItemComponent', () => {
    let component: GraphItemComponent;
    let fixture: ComponentFixture<GraphItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GraphItemComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(GraphItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
