import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemHealthUsersAddComponent } from './system-health-users-add.component';

describe('SystemHealthUsersAddComponent', () => {
    let component: SystemHealthUsersAddComponent;
    let fixture: ComponentFixture<SystemHealthUsersAddComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SystemHealthUsersAddComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SystemHealthUsersAddComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
