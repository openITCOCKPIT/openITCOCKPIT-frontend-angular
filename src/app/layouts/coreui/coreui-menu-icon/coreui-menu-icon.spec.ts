import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreuiMenuIconComponent } from './coreui-menu-icon.component';

describe('CoreuiMenuComponent', () => {
    let component: CoreuiMenuIconComponent;
    let fixture: ComponentFixture<CoreuiMenuIconComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CoreuiMenuIconComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CoreuiMenuIconComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
