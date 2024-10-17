import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarGroupComponent } from './navbar-group.component';

describe('NavbarGroupComponent', () => {
    let component: NavbarGroupComponent;
    let fixture: ComponentFixture<NavbarGroupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NavbarGroupComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(NavbarGroupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
