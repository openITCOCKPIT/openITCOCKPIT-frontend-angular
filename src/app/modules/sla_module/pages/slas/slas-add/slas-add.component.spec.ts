import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlasAddComponent } from './slas-add.component';

describe('SlasAddComponent', () => {
    let component: SlasAddComponent;
    let fixture: ComponentFixture<SlasAddComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SlasAddComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SlasAddComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
