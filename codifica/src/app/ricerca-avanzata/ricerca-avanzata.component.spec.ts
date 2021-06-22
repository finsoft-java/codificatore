import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RicercaAvanzataComponent } from './ricerca-avanzata.component';

describe('RicercaAvanzataComponent', () => {
  let component: RicercaAvanzataComponent;
  let fixture: ComponentFixture<RicercaAvanzataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RicercaAvanzataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RicercaAvanzataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
