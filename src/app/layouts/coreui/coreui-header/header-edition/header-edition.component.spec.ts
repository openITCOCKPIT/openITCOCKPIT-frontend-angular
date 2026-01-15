import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderEditionComponent } from './header-edition.component';

describe('HeaderEditionComponent', () => {
    let component: HeaderEditionComponent;
    let fixture: ComponentFixture<HeaderEditionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HeaderEditionComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HeaderEditionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
