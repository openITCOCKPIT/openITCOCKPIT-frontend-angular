import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
    AddServicetemplatesToServicetemplategroupModalComponent
} from './add-servicetemplates-to-servicetemplategroup-modal.component';

describe('AddServicetemplatesToServicetemplategroupModalComponent', () => {
    let component: AddServicetemplatesToServicetemplategroupModalComponent;
    let fixture: ComponentFixture<AddServicetemplatesToServicetemplategroupModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AddServicetemplatesToServicetemplategroupModalComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AddServicetemplatesToServicetemplategroupModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
