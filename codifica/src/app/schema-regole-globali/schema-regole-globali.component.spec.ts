import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaRegoleGlobaliComponent } from './schema-regole-globali.component';

describe('SchemaRegoleGlobaliComponent', () => {
  let component: SchemaRegoleGlobaliComponent;
  let fixture: ComponentFixture<SchemaRegoleGlobaliComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemaRegoleGlobaliComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaRegoleGlobaliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
