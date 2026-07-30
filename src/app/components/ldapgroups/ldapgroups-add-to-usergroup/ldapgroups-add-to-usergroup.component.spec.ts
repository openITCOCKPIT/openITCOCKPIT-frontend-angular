import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LdapgroupsAddToUsergroupComponent } from './ldapgroups-add-to-usergroup.component';

describe('LdapgroupsAddToUsergroupComponent', () => {
    let component: LdapgroupsAddToUsergroupComponent;
    let fixture: ComponentFixture<LdapgroupsAddToUsergroupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LdapgroupsAddToUsergroupComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(LdapgroupsAddToUsergroupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
