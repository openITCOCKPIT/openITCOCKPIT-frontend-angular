import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalLoadingService } from '../../../global-loading.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'oitc-global-loader',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe
  ],
  templateUrl: './global-loader.component.html',
  styleUrl: './global-loader.component.css',
  animations: [
    trigger('fade', [
      state('visible', style({opacity: 1})),
      state('hidden', style({opacity: 0})),
      transition('visible => hidden', animate('0.6s ease-out')),
      transition('hidden => visible', style('*')),
    ])]
})
export class GlobalLoaderComponent implements OnInit, OnDestroy {

  public isTextVisible: boolean = true;
  private subscriptions: Subscription = new Subscription();

  constructor(public loader: GlobalLoadingService) {
  }

  public ngOnInit() {
    this.subscriptions.add(this.loader.isLoading$.subscribe(loading => {
      this.isTextVisible = loading;
    }));
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
