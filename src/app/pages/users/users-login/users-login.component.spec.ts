import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersLoginComponent } from './users-login.component';

describe('UsersLoginComponent', () => {
    let component: UsersLoginComponent;
    let fixture: ComponentFixture<UsersLoginComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UsersLoginComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(UsersLoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
