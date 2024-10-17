import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacketmanagerIndexComponent } from './packetmanager-index.component';

describe('PacketmanagerIndexComponent', () => {
    let component: PacketmanagerIndexComponent;
    let fixture: ComponentFixture<PacketmanagerIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PacketmanagerIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PacketmanagerIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
