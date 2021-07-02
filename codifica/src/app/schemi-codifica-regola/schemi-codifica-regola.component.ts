import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { SchemaCodificaRegole } from '../_models';
import { SchemiCodificaRegoleService } from '../_services/schemi-codifica-regole.service';
import { AlertService } from '../_services/alert.service';

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

  isAddRuleActive: boolean = false;

  constructor(
    public schemiCodificaRegolaService: SchemiCodificaRegoleService,
    public alertService: AlertService
  ) { }

  ngOnInit(): void {
  }

  onChangeRequired(event: any) {
    this.regola.REQUIRED = event.source.checked ? 'Y' : 'n';
  }

  addOption() {
    this.regola.OPTIONS?.unshift({
      ID_SCHEMA: -1,
      NOM_VARIABILE: this.regola.NOM_VARIABILE,
      VALUE_OPTION: '',
      ETICHETTA: ''
    });
    this.isAddRuleActive = true;
    this.regoleTable?.renderRows();
  }
  removeOption() {
    this.regola.OPTIONS?.shift();
    this.isAddRuleActive = false;
    this.regoleTable?.renderRows();
  }
  saveOption() {
    this.regola.OPTIONS![0].ID_SCHEMA = this.regola.ID_SCHEMA;
    console.log(this.regola);
    this.schemiCodificaRegolaService.update(this.regola).subscribe(
      response => {
        console.log(response.value);
      },
      error => {
        if (error.status === 401 || error.status === 403) {
          this.alertService.error('Errore del Server');
        } else {
          // Ad esempio: Impossibile conettersi al server PHP
          this.alertService.error(error);
        }
        // this.loading = false;
      }
    );
    this.regoleTable?.renderRows();
    this.isAddRuleActive = false;
  }
}
