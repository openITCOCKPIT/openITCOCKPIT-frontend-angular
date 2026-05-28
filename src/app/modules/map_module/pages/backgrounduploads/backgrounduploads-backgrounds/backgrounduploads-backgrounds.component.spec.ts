import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgrounduploadsBackgroundsComponent } from './backgrounduploads-backgrounds.component';

describe('BackgrounduploadsBackgroundsComponent', () => {
    let component: BackgrounduploadsBackgroundsComponent;
    let fixture: ComponentFixture<BackgrounduploadsBackgroundsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BackgrounduploadsBackgroundsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(
            BackgrounduploadsBackgroundsComponent,
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
