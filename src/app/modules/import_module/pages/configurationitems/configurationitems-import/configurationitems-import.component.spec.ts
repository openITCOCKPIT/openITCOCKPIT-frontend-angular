import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationitemsImportComponent } from './configurationitems-import.component';

describe('ConfigurationitemsImportComponent', () => {
    let component: ConfigurationitemsImportComponent;
    let fixture: ComponentFixture<ConfigurationitemsImportComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConfigurationitemsImportComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ConfigurationitemsImportComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
