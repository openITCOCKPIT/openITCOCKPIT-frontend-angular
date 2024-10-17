import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentationsViewComponent } from './documentations-view.component';

describe('DocumentationsViewComponent', () => {
    let component: DocumentationsViewComponent;
    let fixture: ComponentFixture<DocumentationsViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DocumentationsViewComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DocumentationsViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
