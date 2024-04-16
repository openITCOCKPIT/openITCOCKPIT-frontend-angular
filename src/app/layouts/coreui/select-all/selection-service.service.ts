import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectionServiceService {


  private selectionSubject = new BehaviorSubject<any[]>([]);
  public selection$ = this.selectionSubject.asObservable();

  private selectAllSubject = new BehaviorSubject<boolean>(false);
  public selectAll$ = this.selectAllSubject.asObservable();

  public currentSelection: any[] = [];

  constructor() {
  }


  public selectAll(): void {
    // Clear current selection
    this.currentSelection = [];

    // Notify all item-select components that they should be checked
    this.selectAllSubject.next(true);
  }

  public delelectAll(): void {
    this.selectAllSubject.next(false);

    // Clear current selection
    this.currentSelection = [];

    // Update all subscribers
    this.selectionSubject.next(this.currentSelection);
  }

  public selectItem(item: any): void {
    this.currentSelection.push(item);

    // Tell all subscribers about the new selection
    this.selectionSubject.next(this.currentSelection);
  }

  public deselectItem(item: any): void {
    // Remove the given item from the current selection
    this.currentSelection = this.currentSelection.filter(obj => obj !== item);

    // Tell all subscribers about the new selection
    this.selectionSubject.next(this.currentSelection);
  }

  public getSelectedItems(): any[] {
    return this.currentSelection;
  }

}
