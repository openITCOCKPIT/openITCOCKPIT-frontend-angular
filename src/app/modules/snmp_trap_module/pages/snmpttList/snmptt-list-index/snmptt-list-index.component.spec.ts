import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnmpttListIndexComponent } from './snmptt-list-index.component';

describe('SnmpttListIndexComponent', () => {
    let component: SnmpttListIndexComponent;
    let fixture: ComponentFixture<SnmpttListIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SnmpttListIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SnmpttListIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
