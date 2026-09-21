import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LdapgroupsIndexComponent } from './ldapgroups-index.component';

describe('LdapgroupsIndexComponent', () => {
    let component: LdapgroupsIndexComponent;
    let fixture: ComponentFixture<LdapgroupsIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LdapgroupsIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(LdapgroupsIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
