import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsergroupsAppendComponent } from './usergroups-append.component';

describe('UsergroupsAppendComponent', () => {
    let component: UsergroupsAppendComponent;
    let fixture: ComponentFixture<UsergroupsAppendComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UsergroupsAppendComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(UsergroupsAppendComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
