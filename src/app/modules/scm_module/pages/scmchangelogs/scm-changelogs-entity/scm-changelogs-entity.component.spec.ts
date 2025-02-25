import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScmChangelogsEntityComponent } from './scm-changelogs-entity.component';

describe('ChangelogsEntityComponent', () => {
    let component: ScmChangelogsEntityComponent;
    let fixture: ComponentFixture<ScmChangelogsEntityComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ScmChangelogsEntityComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ScmChangelogsEntityComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
