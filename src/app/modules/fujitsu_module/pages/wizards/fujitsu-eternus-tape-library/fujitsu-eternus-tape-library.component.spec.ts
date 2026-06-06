import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FujitsuEternusTapeLibraryComponent } from './fujitsu-eternus-tape-library.component';

describe('FujitsuEternusTapeLibraryComponent', () => {
    let component: FujitsuEternusTapeLibraryComponent;
    let fixture: ComponentFixture<FujitsuEternusTapeLibraryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FujitsuEternusTapeLibraryComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FujitsuEternusTapeLibraryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
