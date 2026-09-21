import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDefaultTemplatesAddComponent } from './user-default-templates-add.component';

describe('UserDefaultTemplatesAddComponent', () => {
    let component: UserDefaultTemplatesAddComponent;
    let fixture: ComponentFixture<UserDefaultTemplatesAddComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UserDefaultTemplatesAddComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(UserDefaultTemplatesAddComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
