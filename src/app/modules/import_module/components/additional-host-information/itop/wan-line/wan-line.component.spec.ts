import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WanLineComponent } from './wan-line.component';

describe('WanLineComponent', () => {
    let component: WanLineComponent;
    let fixture: ComponentFixture<WanLineComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WanLineComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(WanLineComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
