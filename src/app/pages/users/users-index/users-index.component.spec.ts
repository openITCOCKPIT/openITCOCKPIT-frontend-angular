import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersIndexComponent } from './users-index.component';

describe('UsersIndexComponent', () => {
    let component: UsersIndexComponent;
    let fixture: ComponentFixture<UsersIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UsersIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(UsersIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
