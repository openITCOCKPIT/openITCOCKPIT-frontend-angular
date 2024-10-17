import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportChangelogsEntityComponent } from './import-changelogs-entity.component';

describe('ChangelogsEntityComponent', () => {
    let component: ImportChangelogsEntityComponent;
    let fixture: ComponentFixture<ImportChangelogsEntityComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ImportChangelogsEntityComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ImportChangelogsEntityComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
