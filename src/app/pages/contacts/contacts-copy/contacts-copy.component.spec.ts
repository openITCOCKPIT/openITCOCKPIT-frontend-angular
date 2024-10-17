import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsCopyComponent } from './contacts-copy.component';

describe('ContactsCopyComponent', () => {
    let component: ContactsCopyComponent;
    let fixture: ComponentFixture<ContactsCopyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ContactsCopyComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ContactsCopyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
