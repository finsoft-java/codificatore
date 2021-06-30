import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { SchemaCodificaRegole } from '../_models';

@Component({
  selector: 'app-schemi-codifica-regola',
  templateUrl: './schemi-codifica-regola.component.html',
  styleUrls: ['./schemi-codifica-regola.component.css']
})
export class SchemiCodificaRegolaComponent implements OnInit {
  @Input() regola: SchemaCodificaRegole = {
    ID_SCHEMA: 0,
    NOM_VARIABILE: '',
    ORD_PRESENTAZIONE: 0,
    ETICHETTA: '',
    REQUIRED: '',
    TIPO: '',
    MAXLENGTH: 0,
    PATTERN_REGEXP: '',
    NUM_DECIMALI: 0,
    MIN: 0,
    MAX: 0
  };

  @ViewChild('regoleTable') regoleTable?: MatTable<SchemaCodificaRegole>;

  types: any[]= [
    { label: 'Testo', value: 'text' },
    { label: 'Numero', value: 'number' },
    { label: 'Elenco', value: 'elenco' },
    { label: 'Sottoschema', value: 'sottoschema' }];

  constructor() { }

  ngOnInit(): void {
    console.log(this.regola);
  }

  log() {
    console.log(this.regola);
  }

  addOption() {
    this.regola.OPTIONS?.unshift({
      ID_SCHEMA: this.regola.ID_SCHEMA,
      NOM_VARIABILE: this.regola.NOM_VARIABILE,
      VALUE_OPTION: '',
      ETICHETTA: ''
    });
    this.regoleTable?.renderRows();
  }
  removeOption() {
    this.regola.OPTIONS?.shift();
    this.regoleTable?.renderRows();
  }
  saveOption(etichetta: string) {
    this.regola.OPTIONS![0].ETICHETTA = etichetta;
    this.regola.OPTIONS![0].VALUE_OPTION = 'a';
    this.regoleTable?.renderRows();
  }
}
