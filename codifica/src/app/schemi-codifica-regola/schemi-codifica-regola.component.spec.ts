import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemiCodificaRegolaComponent } from './schemi-codifica-regola.component';

describe('SchemiCodificaRegolaComponent', () => {
  let component: SchemiCodificaRegolaComponent;
  let fixture: ComponentFixture<SchemiCodificaRegolaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemiCodificaRegolaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemiCodificaRegolaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
