import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostdefaultsAddComponent } from './hostdefaults-add.component';

describe('HostdefaultsAddComponent', () => {
    let component: HostdefaultsAddComponent;
    let fixture: ComponentFixture<HostdefaultsAddComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostdefaultsAddComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostdefaultsAddComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
