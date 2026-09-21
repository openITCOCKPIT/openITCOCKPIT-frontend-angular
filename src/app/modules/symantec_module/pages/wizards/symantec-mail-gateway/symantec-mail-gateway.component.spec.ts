import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SymantecMailGatewayComponent } from './symantec-mail-gateway.component';

describe('SymantecMailGatewayComponent', () => {
    let component: SymantecMailGatewayComponent;
    let fixture: ComponentFixture<SymantecMailGatewayComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SymantecMailGatewayComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SymantecMailGatewayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
