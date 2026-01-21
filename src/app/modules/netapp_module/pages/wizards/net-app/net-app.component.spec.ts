import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetAppComponent } from './net-app.component';

describe('NetAppComponent', () => {
    let component: NetAppComponent;
    let fixture: ComponentFixture<NetAppComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NetAppComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(NetAppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
