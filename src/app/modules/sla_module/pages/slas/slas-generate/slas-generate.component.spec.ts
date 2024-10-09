import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlasGenerateComponent } from './slas-generate.component';

describe('SlasGenerateComponent', () => {
    let component: SlasGenerateComponent;
    let fixture: ComponentFixture<SlasGenerateComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SlasGenerateComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SlasGenerateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
