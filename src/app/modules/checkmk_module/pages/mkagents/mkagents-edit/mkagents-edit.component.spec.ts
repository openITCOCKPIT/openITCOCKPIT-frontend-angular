import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MkagentsEditComponent } from './mkagents-edit.component';

describe('MkagentsEditComponent', () => {
    let component: MkagentsEditComponent;
    let fixture: ComponentFixture<MkagentsEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MkagentsEditComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MkagentsEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
