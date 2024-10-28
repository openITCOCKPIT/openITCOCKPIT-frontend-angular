/*
 * Copyright (C) <2015>  <it-novum GmbH>
 *
 * This file is dual licensed
 *
 * 1.
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, version 3 of the License.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * 2.
 *     If you purchased an openITCOCKPIT Enterprise Edition you can use this file
 *     under the terms of the openITCOCKPIT Enterprise Edition license agreement.
 *     License agreement and license key will be shipped with the order
 *     confirmation.
 */

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {PermissionDirective} from '../../../permissions/permission.directive';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective, FormControlDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import {BackButtonDirective} from '../../../directives/back-button.directive';
import {XsButtonDirective} from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import {RequiredIconComponent} from '../../../components/required-icon/required-icon.component';
import {FormErrorDirective} from '../../../layouts/coreui/form-error.directive';
import {SelectComponent} from '../../../layouts/primeng/select/select/select.component';
import { StatuspagesService } from '../statuspages.service';
import {Subscription} from 'rxjs';
import {SelectKeyValue} from '../../../layouts/primeng/select.interface';
import {
    StatuspagePost, SelectKeyValueExtended}
    from '../statuspage.interface';
import { GenericValidationError } from '../../../generic-responses';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import {NgForOf, NgIf} from '@angular/common';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import {MultiSelectComponent} from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';

@Component({
  selector: 'oitc-statuspages-add',
  standalone: true,
    imports: [
        TranslocoDirective,
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        NavComponent,
        BackButtonDirective,
        NavItemComponent,
        XsButtonDirective,
        CardBodyComponent,
        FormLabelDirective,
        RequiredIconComponent,
        FormErrorDirective,
        SelectComponent,
        FormDirective,
        FormsModule,
        PaginatorModule,
        NgIf,
        FormFeedbackComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        MultiSelectComponent,
        NgForOf
    ],
  templateUrl: './statuspages-add.component.html',
  styleUrl: './statuspages-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatuspagesAddComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription = new Subscription();
    private StatuspagesService: StatuspagesService = inject(StatuspagesService);
    private cdr = inject(ChangeDetectorRef);
    public containers: SelectKeyValue[] = [];
    public hostgroups: SelectKeyValueExtended[] = [];
    public hosts: SelectKeyValueExtended[] = [];
    public services: SelectKeyValueExtended[] = [];
    public servicegroups: SelectKeyValueExtended[] = [];
    public post: StatuspagePost = {} as StatuspagePost;
    public errors: GenericValidationError | null = null;
    public hostsFilldata : any = {};

    public ngOnInit(): void {
            //Fire on page load
            this.post = this.getDefaultPost();
            this.loadContainers();
        this.cdr.markForCheck();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadContainers() {
        this.subscriptions.add(this.StatuspagesService.loadContainers()
            .subscribe((result) => {
                this.containers = result;
                this.cdr.markForCheck();
            })
        );
    }

    loadHostgroups(searchstring: string) {
        if(this.post.container_id === null){
            return;
        }
        this.subscriptions.add(this.StatuspagesService.loadHostgroups(this.post.container_id, '',[] )
            .subscribe((result) => {
                let hostgroupObjects:SelectKeyValueExtended[]  = [];
                result.map((item: SelectKeyValue) => {
                    let objectEntry: SelectKeyValueExtended = {key: 0, value: '', id: 0, _joinData: {display_alias: ''}};
                    objectEntry.key = item.key;
                    objectEntry.id = item.key;
                    objectEntry.value = item.value;
                    objectEntry._joinData.display_alias = "";
                    hostgroupObjects.push(objectEntry);
                });
                this.hostgroups= hostgroupObjects;
                this.cdr.markForCheck();
            })
        );
    }
    loadHosts(searchstring: string) {
        if(this.post.container_id === null){
            return;
        }
        this.subscriptions.add(this.StatuspagesService.loadHosts(this.post.container_id, '',[] )
            .subscribe((result) => {
                let hostsObjects:SelectKeyValueExtended[]  = [];

                result.map((item: SelectKeyValue) => {
                    let objectEntry: SelectKeyValueExtended = {key: 0, value: '', id: 0, _joinData: {display_alias: ''}};
                    objectEntry.key = item.key;
                    objectEntry.id = item.key;
                    objectEntry.value = item.value;
                    objectEntry._joinData.display_alias = "";
                    hostsObjects.push(objectEntry);
                });
                this.hosts = hostsObjects;
                this.cdr.markForCheck();
            })
        );
    }

    public loadServices(searchstring: string) {
        if(this.post.container_id === null){
            return;
        }
        this.subscriptions.add(this.StatuspagesService.loadServices(this.post.container_id, '',[] )
            .subscribe((result) => {
                let servicesObjects:SelectKeyValueExtended[]  = [];

                result.map((item: SelectKeyValue) => {
                    let objectEntry: SelectKeyValueExtended = {key: 0, value: {}, id: 0, _joinData: {display_alias: ''}};
                    objectEntry.key = item.key;
                    objectEntry.id = item.key;
                    objectEntry.value = item.value;
                    objectEntry._joinData.display_alias = "";
                    servicesObjects.push(objectEntry);
                });
                this.services = servicesObjects;
                this.cdr.markForCheck();
            })
        );
    }

    public loadServicegroups(searchstring: string) {
        if(this.post.container_id === null){
            return;
        }
        this.subscriptions.add(this.StatuspagesService.loadServicegroups(this.post.container_id, '',[] )
            .subscribe((result) => {
                let servicegroupsObjects:SelectKeyValueExtended[]  = [];

                result.map((item: SelectKeyValue) => {
                    let objectEntry: SelectKeyValueExtended = {key: 0, value: {}, id: 0, _joinData: {display_alias: ''}};
                    objectEntry.key = item.key;
                    objectEntry.id = item.key;
                    objectEntry.value = item.value;
                    objectEntry._joinData.display_alias = "";
                    servicegroupsObjects.push(objectEntry);
                });
                this.servicegroups = servicegroupsObjects;
                this.cdr.markForCheck();
            })
        );
    }

   /* public selectedChange(value: any) {
        console.log(value);
    } */


    public onContainerChange(){
        this.loadHostgroups('');
        this.loadHosts('');
        this.loadServices('');
    }

    private getDefaultPost(): StatuspagePost {

        return {
            container_id: null,
            name: '',
            description: '',
            public: 0,
            show_downtimes: 0,
            show_downtime_comments: 0,
            show_acknowledgements: 0,
            show_acknowledgement_comments: 0,
            selected_hostgroups: {
                _ids: []
            },
            selected_hosts: {
                _ids: []
            },
            selected_servicegroups: {
                _ids: []
            },
            selected_services: {
                _ids: []
            },
            hostgroups: {},
            hosts: {},
            servicegroups: {},
            services: {},
        };
    }

    public addStatuspage(){

    }

    protected readonly String = String;
    protected readonly Number = Number;
}
