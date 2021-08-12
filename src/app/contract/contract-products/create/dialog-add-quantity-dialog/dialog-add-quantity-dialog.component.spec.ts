import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddQuantityDialogComponent } from './dialog-add-quantity-dialog.component';

describe('DialogAddQuantityDialogComponent', () => {
  let component: DialogAddQuantityDialogComponent;
  let fixture: ComponentFixture<DialogAddQuantityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAddQuantityDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddQuantityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
