import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MkagentsIndexComponent } from './mkagents-index.component';

describe('MkagentsIndexComponent', () => {
    let component: MkagentsIndexComponent;
    let fixture: ComponentFixture<MkagentsIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MkagentsIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MkagentsIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
