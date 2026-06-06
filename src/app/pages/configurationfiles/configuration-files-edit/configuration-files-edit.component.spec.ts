import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationFilesEditComponent } from './configuration-files-edit.component';

describe('ConfigurationFilesEditComponent', () => {
    let component: ConfigurationFilesEditComponent;
    let fixture: ComponentFixture<ConfigurationFilesEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConfigurationFilesEditComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ConfigurationFilesEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
