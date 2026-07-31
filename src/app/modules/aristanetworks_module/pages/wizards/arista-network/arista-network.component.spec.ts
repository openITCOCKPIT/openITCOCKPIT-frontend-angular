import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AristaNetworkComponent } from './arista-network.component';

describe('AristaNetworkComponent', () => {
    let component: AristaNetworkComponent;
    let fixture: ComponentFixture<AristaNetworkComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AristaNetworkComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AristaNetworkComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
