import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangelogsEntryComponent } from './changelogs-entry.component';

describe('ChangelogsEntryComponent', () => {
    let component: ChangelogsEntryComponent;
    let fixture: ComponentFixture<ChangelogsEntryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ChangelogsEntryComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ChangelogsEntryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
