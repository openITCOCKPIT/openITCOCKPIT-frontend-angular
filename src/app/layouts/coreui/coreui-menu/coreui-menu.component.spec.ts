import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreuiMenuComponent } from './coreui-menu.component';

describe('CoreuiMenuComponent', () => {
    let component: CoreuiMenuComponent;
    let fixture: ComponentFixture<CoreuiMenuComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CoreuiMenuComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CoreuiMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
