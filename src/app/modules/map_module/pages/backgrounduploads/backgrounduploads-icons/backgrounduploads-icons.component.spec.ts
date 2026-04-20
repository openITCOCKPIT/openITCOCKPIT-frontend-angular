import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgrounduploadsIconsComponent } from './backgrounduploads-icons.component';

describe('BackgrounduploadsIconsComponent', () => {
    let component: BackgrounduploadsIconsComponent;
    let fixture: ComponentFixture<BackgrounduploadsIconsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BackgrounduploadsIconsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BackgrounduploadsIconsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
