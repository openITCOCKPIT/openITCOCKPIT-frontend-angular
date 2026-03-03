import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentationsWikiComponent } from './documentations-wiki.component';

describe('DocumentationsWikiComponent', () => {
    let component: DocumentationsWikiComponent;
    let fixture: ComponentFixture<DocumentationsWikiComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DocumentationsWikiComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DocumentationsWikiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
