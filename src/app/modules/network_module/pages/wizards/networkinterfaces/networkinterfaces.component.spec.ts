import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkinterfacesComponent } from './networkinterfaces.component';

describe('NetworkinterfacesComponent', () => {
    let component: NetworkinterfacesComponent;
    let fixture: ComponentFixture<NetworkinterfacesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NetworkinterfacesComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(NetworkinterfacesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
