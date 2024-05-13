import {Component, inject, Input, OnInit, OnDestroy} from '@angular/core';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {NgIf} from '@angular/common';
import {PopoverDirective} from '@coreui/angular';
import { DowntimeTooltipService } from './downtime-tooltip.service';
import {Subscription} from 'rxjs';
import {TranslocoDirective} from '@jsverse/transloco';

@Component({
  selector: 'oitc-downtime-tooltip',
  standalone: true,
    imports: [
        FaIconComponent,
        NgIf,
        PopoverDirective,
        TranslocoDirective
    ],
  templateUrl: './downtime-tooltip.component.html',
  styleUrl: './downtime-tooltip.component.css'
})
export class DowntimeTooltipComponent {
    @Input()
    set type (type:any){
        this._type = type;
    }
    get type(){
        return this._type;
    }

    //@Input() id: number = 0;
    @Input()
    set id (id:any){
        this.objId = id;
    }
    get id(){
        return this.objId;
    }

    public _type:string = '';
    public _subtype:number = 0;
    public objId: number = 0;
    public visible:boolean = false;
    public url:string = '';
    private subscriptions: Subscription = new Subscription();
    private DowntimeTooltipService= inject(DowntimeTooltipService);
    public data!: any;
    public sticky: boolean = false;
    public author: string = '';
    public start : string = '';
    public end : string = '';
    public comment: string = '';

    ngOnInit () {
        this.url = this.type + '/browser/' + this.id + ".json";
    }

    showTooltip(){
        this.getData()
        this.visible = !this.visible;
    }

    hideTooltip(){
        this.visible = !this.visible;
    }

    getData() {
        this.subscriptions.add(this.DowntimeTooltipService.getData(this.url)
            .subscribe((data) => {
                this.data = data;
                this.author = data.downtime.authorName ?? '';
                this.start = data.downtime.scheduledStartTime ?? '';
                this.end = data.downtime.scheduledEndTime ?? '';
                this.comment = data.downtime.commentData ?? '';
            })
        );
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

}
