import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcomBESComponent } from './broadcom-bes.component';

describe('BroadcomBESComponent', () => {
    let component: BroadcomBESComponent;
    let fixture: ComponentFixture<BroadcomBESComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BroadcomBESComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(BroadcomBESComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
