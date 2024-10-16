import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangelogsEntityComponent } from './changelogs-entity.component';

describe('ChangelogsEntityComponent', () => {
    let component: ChangelogsEntityComponent;
    let fixture: ComponentFixture<ChangelogsEntityComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ChangelogsEntityComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ChangelogsEntityComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
