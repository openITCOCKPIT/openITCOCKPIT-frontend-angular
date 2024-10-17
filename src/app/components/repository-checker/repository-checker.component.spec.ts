import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositoryCheckerComponent } from './repository-checker.component';

describe('RepositoryCheckerComponent', () => {
    let component: RepositoryCheckerComponent;
    let fixture: ComponentFixture<RepositoryCheckerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RepositoryCheckerComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(RepositoryCheckerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
