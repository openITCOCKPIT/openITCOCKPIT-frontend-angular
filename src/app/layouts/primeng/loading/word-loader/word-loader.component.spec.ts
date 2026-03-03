import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordLoaderComponent } from './word-loader.component';

describe('WordLoaderComponent', () => {
    let component: WordLoaderComponent;
    let fixture: ComponentFixture<WordLoaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WordLoaderComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(WordLoaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
