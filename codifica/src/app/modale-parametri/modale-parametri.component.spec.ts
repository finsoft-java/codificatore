import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaleParametriComponent } from './modale-parametri.component';

describe('ModaleParametriComponent', () => {
  let component: ModaleParametriComponent;
  let fixture: ComponentFixture<ModaleParametriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModaleParametriComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModaleParametriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
