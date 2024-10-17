import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeMirrorContainerComponent } from './code-mirror-container.component';

describe('CodeMirrorContainerComponent', () => {
    let component: CodeMirrorContainerComponent;
    let fixture: ComponentFixture<CodeMirrorContainerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CodeMirrorContainerComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CodeMirrorContainerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
