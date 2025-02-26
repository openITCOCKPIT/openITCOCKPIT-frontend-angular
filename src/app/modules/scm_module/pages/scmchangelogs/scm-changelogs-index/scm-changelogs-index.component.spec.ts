import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScmChangelogsIndexComponent } from './scm-changelogs-index.component';

describe('ScmChangelogsIndexComponent', () => {
    let component: ScmChangelogsIndexComponent;
    let fixture: ComponentFixture<ScmChangelogsIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ScmChangelogsIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ScmChangelogsIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
