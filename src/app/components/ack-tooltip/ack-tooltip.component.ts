import {Component, inject, Input, OnInit, OnDestroy} from '@angular/core';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {NgIf} from '@angular/common';
import {PopoverDirective} from '@coreui/angular';
import { AckTooltipService } from './ack-tooltip.service';
import {Subscription} from 'rxjs';
import {TranslocoDirective} from '@jsverse/transloco';
import { debounce } from '../debounce.decorator';

@Component({
  selector: 'oitc-ack-tooltip',
  standalone: true,
    imports: [
        FaIconComponent,
        NgIf,
        PopoverDirective,
        TranslocoDirective
    ],
  templateUrl: './ack-tooltip.component.html',
  styleUrl: './ack-tooltip.component.css'
})
export class AckTooltipComponent implements OnInit, OnDestroy {
    @Input()
        set type (type:any){
            this._type = type;
        }
        get type(){
            return this._type;
        }

    @Input()
        set subtype (type:any){
            this._subtype = type;
        }
        get subtype(){
            return this._subtype;
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
    private AckTooltipService= inject(AckTooltipService);
    public data!: any;
    public sticky: boolean = false;
    public author: string = '';
    public entry : string = '';
    public comment: string = '';

    ngOnInit () {
        this.url = this.type + '/browser/' + this.id + ".json";
    }


    showTooltip(){
        this.getData()
        //this.visible = !this.visible;
    }

    hideTooltip(){
        this.visible = !this.visible;
    }

    getData() {
        this.subscriptions.add(this.AckTooltipService.getData(this.url)
            .subscribe((data) => {
                this.data = data;

                if (data.acknowledgement.is_sticky) {
                    this.sticky = true;
                } else {
                    this.sticky = false;
                }
                this.author = data.acknowledgement.author_name ?? '';
                this.entry = data.acknowledgement.entry_time ?? '';
                this.comment = data.acknowledgement.comment_data ?? '';
                this.visible = !this.visible;
            })
        );
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
