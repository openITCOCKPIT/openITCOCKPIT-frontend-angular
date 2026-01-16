import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhpinfoComponent } from './phpinfo.component';

describe('PhpinfoComponent', () => {
    let component: PhpinfoComponent;
    let fixture: ComponentFixture<PhpinfoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PhpinfoComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PhpinfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
