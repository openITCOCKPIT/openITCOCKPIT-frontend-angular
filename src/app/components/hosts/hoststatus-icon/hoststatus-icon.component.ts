import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import {TooltipDirective} from '@coreui/angular';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {timer, Subject, takeUntil, Subscription} from "rxjs";
type Hoststatus = {
    currentState: number
    isFlapping: boolean
    problemHasBeenAcknowledged: boolean
    scheduledDowntimeDepth: any
    lastCheck: string
    nextCheck: string
    activeChecksEnabled: any
    lastHardState: any
    lastHardStateChange: string
    last_state_change: string
    output: any
    long_output: any
    acknowledgement_type: any
    state_type: boolean
    flap_detection_enabled: any
    notifications_enabled: any
    current_check_attempt: any
    max_check_attempts: any
    latency: any
    last_time_up: string
    lastHardStateChangeInWords: string
    last_state_change_in_words: string
    lastCheckInWords: string
    nextCheckInWords: string
    isHardstate: boolean
    isInMonitoring: boolean
    humanState: string
    cssClass: string
    textClass: string
    outputHtml: string
}

@Component({
  selector: 'oitc-hoststatus-icon',
  standalone: true,
    imports: [ NgClass, NgIf, TooltipDirective, FaIconComponent ],
  templateUrl: './hoststatus-icon.component.html',
  styleUrl: './hoststatus-icon.component.css'
})
export class HoststatusIconComponent implements OnInit, OnDestroy{

    @Input()
    get host() {
        return this.status;
    }

    set host(host: Hoststatus) {
        this.status = host;
    }

    stopPlay$: Subject<any> = new Subject();
    subscription: Subscription= new Subscription();
    protected status!: Hoststatus;
    protected isFlapping: boolean = false;
    protected humanState: string = '';
    protected isHardstate: boolean = false;
    protected title:string = '';
    protected btnColor: string = '';
    protected flappingColor: string = '';
    protected opacity: string = '';
    protected flappingState: boolean = false;

    ngOnInit() {
        this.setHostStatusColors();
    }

    setHostStatusColors() {
        let currentstate: number  = -1;
        currentstate = parseInt(String(this.status.currentState), 10);
        this.humanState = this.status.humanState;
        this.isHardstate = this.status.isHardstate;
        this.title = this.status.humanState;
        this.isFlapping = this.status.isFlapping;

        switch(currentstate){
            case 0:
                this.btnColor = 'success';
                this.flappingColor = 'text-success';
                this.humanState = this.humanState || 'up';
                break;
            case 1:
                this.btnColor = 'danger';
                this.flappingColor = 'text-danger';
                this.humanState = this.humanState || 'down';
                break;
            case 2:
                this.btnColor = 'secondary';
                this.flappingColor = 'text-secondary';
                this.humanState = this.humanState || 'unreachable';
                break;
            default:
                this.btnColor = 'primary';
                this.flappingColor = 'text-primary';
                this.humanState = this.humanState || 'not in monitoring';
        }

        if(this.isHardstate){
            this.title = this.title + ' (HARD)';
        } else {
            this.title = this.title + ' (SOFT)';
            this.opacity = 'opacity-50 ';
        }
        if(this.isFlapping){
            this.startFlap();
        }
    }

    startFlap(){
        if(this.isFlapping){
            timer(0, 750).pipe(
                takeUntil(this.stopPlay$,)
            ).subscribe(t => {
                this.flappingState = !this.flappingState;
            });
        }else {
            this.stopPlay$.next(true);
            // this.stopPlay$.complete();
        }
    }

    public ngOnDestroy() {
        this.stopPlay$.complete();
    }

}
