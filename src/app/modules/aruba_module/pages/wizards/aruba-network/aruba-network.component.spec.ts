import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArubaNetworkComponent } from './aruba-network.component';

describe('ArubaNetworkComponent', () => {
    let component: ArubaNetworkComponent;
    let fixture: ComponentFixture<ArubaNetworkComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ArubaNetworkComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ArubaNetworkComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
