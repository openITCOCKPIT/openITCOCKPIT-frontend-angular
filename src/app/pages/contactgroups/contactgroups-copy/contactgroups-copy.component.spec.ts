import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactgroupsCopyComponent } from './contactgroups-copy.component';

describe('ContactgroupsCopyComponent', () => {
    let component: ContactgroupsCopyComponent;
    let fixture: ComponentFixture<ContactgroupsCopyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ContactgroupsCopyComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ContactgroupsCopyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
