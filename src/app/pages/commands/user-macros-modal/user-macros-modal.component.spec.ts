import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMacrosModalComponent } from './user-macros-modal.component';

describe('UserMacrosModalComponent', () => {
    let component: UserMacrosModalComponent;
    let fixture: ComponentFixture<UserMacrosModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UserMacrosModalComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(UserMacrosModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
