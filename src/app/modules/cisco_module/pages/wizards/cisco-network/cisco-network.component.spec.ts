import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CiscoNetworkComponent } from './cisco-network.component';

describe('CiscoNetworkComponent', () => {
    let component: CiscoNetworkComponent;
    let fixture: ComponentFixture<CiscoNetworkComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CiscoNetworkComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CiscoNetworkComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
