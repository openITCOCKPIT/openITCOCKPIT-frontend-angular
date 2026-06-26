import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LdapgroupsAddToUsercontainerrolesComponent } from './ldapgroups-add-to-usercontainerroles.component';

describe('LdapgroupsAddToUsergroupComponent', () => {
    let component: LdapgroupsAddToUsercontainerrolesComponent;
    let fixture: ComponentFixture<LdapgroupsAddToUsercontainerrolesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LdapgroupsAddToUsercontainerrolesComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(LdapgroupsAddToUsercontainerrolesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
