import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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
  @Input()
  regola!: SchemaCodificaRegole;

  @Input()
  creating = false;

  @Output()
  saved = new EventEmitter<SchemaCodificaRegole>();
  @Output()
  deleted = new EventEmitter<SchemaCodificaRegole>();

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
    this.regola.REQUIRED = event.source.checked ? 'Y' : 'N';
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
    this.regoleTable?.renderRows();
    this.isAddRuleActive = false;
  }

  saveRule() {
    if (this.creating) {
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
}
