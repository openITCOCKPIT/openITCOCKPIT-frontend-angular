import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { TooltipDirective } from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { timer, Subject, takeUntil, Subscription } from "rxjs";
import { Servicestatus } from '../../../pages/services/services.interface';

@Component({
  selector: 'oitc-servicestatus-icon',
  standalone: true,
    imports: [ NgClass, NgIf, TooltipDirective, FaIconComponent ],
  templateUrl: './servicestatus-icon.component.html',
  styleUrl: './servicestatus-icon.component.css'
})
export class ServicestatusIconComponent implements OnInit, OnDestroy {

    @Input()
    get service() {
        return this.status;
    }

    set service(service: Servicestatus) {
        this.status = service;
    }
    stopPlay$: Subject<any> = new Subject();
    subscription: Subscription= new Subscription();
    protected status!: Servicestatus;
    protected isFlapping: boolean = false;
    protected humanState: string = '';
    protected isHardstate: boolean = false;
    protected title:string = '';
    protected btnColor: string = '';
    protected flappingColor: string = '';
    protected opacity: string = '';
    protected flappingState: boolean = false;

    ngOnInit() {
        this.setServiceStatusColors();
    }

    setServiceStatusColors() {
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
                this.btnColor = 'warning';
                this.flappingColor = 'text-warning';
                this.humanState = this.humanState || 'warning';
                break;
            case 2:
                this.btnColor = 'danger';
                this.flappingColor = 'text-danger';
                this.humanState = this.humanState || 'down';
                break;
            case 3:
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
