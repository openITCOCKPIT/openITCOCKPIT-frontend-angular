import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDefaultTemplatesIndexComponent } from './user-default-templates-index.component';

describe('UserDefaultTemplatesIndexComponent', () => {
    let component: UserDefaultTemplatesIndexComponent;
    let fixture: ComponentFixture<UserDefaultTemplatesIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UserDefaultTemplatesIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(UserDefaultTemplatesIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
