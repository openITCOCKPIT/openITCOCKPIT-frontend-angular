import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationFilesIndexComponent } from './configuration-files-index.component';

describe('ConfigurationFilesIndexComponent', () => {
    let component: ConfigurationFilesIndexComponent;
    let fixture: ComponentFixture<ConfigurationFilesIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConfigurationFilesIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ConfigurationFilesIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
