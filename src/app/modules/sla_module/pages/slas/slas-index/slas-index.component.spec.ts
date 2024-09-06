import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlasIndexComponent } from './slas-index.component';

describe('CmdIndexComponent', () => {
    let component: SlasIndexComponent;
    let fixture: ComponentFixture<SlasIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SlasIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SlasIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
