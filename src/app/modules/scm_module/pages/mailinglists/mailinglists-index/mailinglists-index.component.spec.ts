import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailinglistsIndexComponent } from './mailinglists-index.component';

describe('MailinglistsIndexComponent', () => {
    let component: MailinglistsIndexComponent;
    let fixture: ComponentFixture<MailinglistsIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MailinglistsIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MailinglistsIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
