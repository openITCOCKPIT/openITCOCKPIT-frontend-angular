import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextcloudComponent } from './nextcloud.component';

describe('NextcloudComponent', () => {
    let component: NextcloudComponent;
    let fixture: ComponentFixture<NextcloudComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NextcloudComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(NextcloudComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
