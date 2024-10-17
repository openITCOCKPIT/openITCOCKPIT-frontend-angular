import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileApikeysComponent } from './profile-apikeys.component';

describe('ProfileApikeysComponent', () => {
    let component: ProfileApikeysComponent;
    let fixture: ComponentFixture<ProfileApikeysComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProfileApikeysComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ProfileApikeysComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
