import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemHealthUsersEditComponent } from './system-health-users-edit.component';

describe('SystemHealthUsersEditComponent', () => {
    let component: SystemHealthUsersEditComponent;
    let fixture: ComponentFixture<SystemHealthUsersEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SystemHealthUsersEditComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SystemHealthUsersEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
