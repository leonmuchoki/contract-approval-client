import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClauseDetailsComponent } from './create-clause-details.component';

describe('CreateClauseDetailsComponent', () => {
  let component: CreateClauseDetailsComponent;
  let fixture: ComponentFixture<CreateClauseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateClauseDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateClauseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
