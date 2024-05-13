import { Component, inject, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ContainerComponent,
    NavComponent,
    TableDirective
} from '@coreui/angular';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { Subscription } from 'rxjs';
import { CommandsService } from '../commands.service';
import { CommandUsedByCommand, CommandUsedBy, CommandUsedByObjects } from '../commands.interface';
import { NgForOf, NgIf } from '@angular/common';
import { MatSort } from '@angular/material/sort';


@Component({
    selector: 'oitc-commands-used-by',
    standalone: true,
    imports: [
        CoreuiComponent,
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        BackButtonDirective,
        NavComponent,
        XsButtonDirective,
        NgIf,
        CardBodyComponent,
        ContainerComponent,
        MatSort,
        TableDirective,
        NgForOf
    ],
    templateUrl: './commands-used-by.component.html',
    styleUrl: './commands-used-by.component.css'
})
export class CommandsUsedByComponent implements OnInit {
    public command: CommandUsedByCommand | undefined;
    public total: number = 0;
    public objects: CommandUsedByObjects | undefined;

    private CommandsService = inject(CommandsService);
    private router = inject(Router);
    private route = inject(ActivatedRoute)

    private subscriptions: Subscription = new Subscription();

    public ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.subscriptions.add(this.CommandsService.usedBy(id)
            .subscribe((result) => {
                this.command = result.command;
                this.objects = result.objects;
                this.total = result.total;
            }));
    }
}
