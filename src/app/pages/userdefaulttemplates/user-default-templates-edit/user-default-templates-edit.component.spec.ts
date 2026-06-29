import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDefaultTemplatesEditComponent } from './user-default-templates-edit.component';

describe('UserDefaultTemplatesEditComponent', () => {
    let component: UserDefaultTemplatesEditComponent;
    let fixture: ComponentFixture<UserDefaultTemplatesEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UserDefaultTemplatesEditComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(UserDefaultTemplatesEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
