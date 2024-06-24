import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableLoaderComponent } from './table-loader.component';

describe('TableLoaderComponent', () => {
  let component: TableLoaderComponent;
  let fixture: ComponentFixture<TableLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
