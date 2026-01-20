import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackupsRestoreComponent } from './backups-restore.component';

describe('BackupsRestoreComponent', () => {
    let component: BackupsRestoreComponent;
    let fixture: ComponentFixture<BackupsRestoreComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BackupsRestoreComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(BackupsRestoreComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
