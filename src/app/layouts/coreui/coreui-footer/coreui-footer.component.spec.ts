import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreuiFooterComponent } from './coreui-footer.component';

describe('CoreuiFooterComponent', () => {
    let component: CoreuiFooterComponent;
    let fixture: ComponentFixture<CoreuiFooterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CoreuiFooterComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CoreuiFooterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
