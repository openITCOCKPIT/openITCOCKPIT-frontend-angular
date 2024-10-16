import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItopOverviewComponent } from './itop-overview.component';

describe('ItopOverviewComponent', () => {
    let component: ItopOverviewComponent;
    let fixture: ComponentFixture<ItopOverviewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ItopOverviewComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ItopOverviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
