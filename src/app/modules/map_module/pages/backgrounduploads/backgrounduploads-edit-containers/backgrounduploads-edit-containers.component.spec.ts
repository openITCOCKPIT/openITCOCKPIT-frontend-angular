import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgrounduploadsEditContainersComponent } from './backgrounduploads-edit-containers.component';

describe('BackgrounduploadsEditContainersComponent', () => {
    let component: BackgrounduploadsEditContainersComponent;
    let fixture: ComponentFixture<BackgrounduploadsEditContainersComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BackgrounduploadsEditContainersComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(
            BackgrounduploadsEditContainersComponent,
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
