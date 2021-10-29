import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { SchemaCodifica, SchemaCodificaOptions, SchemaCodificaRegole, SchemaCodificaSottoschema } from '../_models';
import { SchemiCodificaRegoleService } from '../_services/schemi-codifica-regole.service';
import { AlertService } from '../_services/alert.service';
import { SchemiCodificaService } from '../_services/schemi-codifica.service';

@Component({
  selector: 'app-schemi-codifica-regola',
  templateUrl: './schemi-codifica-regola.component.html',
  styleUrls: ['./schemi-codifica-regola.component.css']
})
export class SchemiCodificaRegolaComponent implements OnInit {
  @Input()
  regola!: SchemaCodificaRegole;

  @Input()
  creating = false;

  @Output()
  saved = new EventEmitter<SchemaCodificaRegole>();
  @Output()
  deleted = new EventEmitter<SchemaCodificaRegole>();

  @ViewChild('optionsTable') optionsTable?: MatTable<SchemaCodificaRegole>;
  @ViewChild('subschemaTable') subschemaTable?: MatTable<SchemaCodificaRegole>;

  types: any[]= [
    { label: 'Testo', value: 'text' },
    { label: 'Numero', value: 'number' },
    { label: 'Elenco', value: 'elenco' },
    { label: 'Sottoschema', value: 'sottoschema' }];

  listaSchemiInterni : SchemaCodifica[] = [];

  constructor(
    public schemiCodificaRegolaService: SchemiCodificaRegoleService,
    public schemiCodificaService: SchemiCodificaService,
    public alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.schemiCodificaService.getValidiInterni().subscribe(response => {
      this.listaSchemiInterni = response.data;
    });
  }

  onChangeRequired(event: any) {
    this.regola.REQUIRED = event.source.checked ? 'Y' : 'N';
  }

  addOption() {
    if (this.regola.OPTIONS === undefined || this.regola.OPTIONS === null) {
      this.regola.OPTIONS = [];
    }
    this.regola.OPTIONS!.unshift({
      ID_REGOLA: this.regola.ID_REGOLA,
      VALUE_OPTION: '',
      ETICHETTA: ''
    });
    this.optionsTable?.renderRows(); // force render
  }

  removeOption(option: SchemaCodificaOptions) {
    this.regola.OPTIONS?.splice(this.regola.OPTIONS?.findIndex(x => x.ETICHETTA == option.ETICHETTA), 1);
    this.optionsTable?.renderRows(); // force render
  }

  saveRule() {
    if (this.creating) {
      if (!/^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(this.regola.NOM_VARIABILE)) {
        this.alertService.error('Nome variabile non valido.');
        return;
      }
      this.schemiCodificaRegolaService.create(this.regola).subscribe(
        response => {
          console.log(response.value);
          this.regola = response.value;
          this.saved.emit(this.regola);
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
    } else {
      this.schemiCodificaRegolaService.update(this.regola).subscribe(
        response => {
          console.log(response.value);
          this.regola = response.value;
          this.saved.emit(this.regola);
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
    }
  }

  deleteRule() {
    this.schemiCodificaRegolaService.delete(this.regola).subscribe(
      response => {
        console.log("ECCOMI QUI ORA EMETTO");
        this.deleted.emit(this.regola);
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
  }

  addSubschema() {
    if (this.regola.SOTTOSCHEMI === undefined || this.regola.SOTTOSCHEMI === null) {
      this.regola.SOTTOSCHEMI = [];
    }
    this.regola.SOTTOSCHEMI!.unshift({
      ID_REGOLA: this.regola.ID_REGOLA,
      ID_SOTTO_SCHEMA: -1
    });
    this.subschemaTable?.renderRows(); // force render
  }

  removeSubschema(subschema: SchemaCodificaSottoschema) {
    this.regola.SOTTOSCHEMI?.splice(this.regola.SOTTOSCHEMI?.findIndex(x => x.ID_SOTTO_SCHEMA == subschema.ID_SOTTO_SCHEMA), 1);
    this.subschemaTable?.renderRows(); // force render
  }
}
