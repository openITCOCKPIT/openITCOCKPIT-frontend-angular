import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgrounduploadsIconsetsComponent } from './backgrounduploads-iconsets.component';

describe('BackgrounduploadsIconsetsComponent', () => {
    let component: BackgrounduploadsIconsetsComponent;
    let fixture: ComponentFixture<BackgrounduploadsIconsetsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BackgrounduploadsIconsetsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BackgrounduploadsIconsetsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
