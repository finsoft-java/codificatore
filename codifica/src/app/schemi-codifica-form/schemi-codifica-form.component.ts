import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SchemaCodificaOptions, SchemaCodificaRegole } from '../_models';
import { SchemiCodificaOpzioniService } from '../_services/schemi-codifica-opzioni.service';
import { SchemiCodificaService } from '../_services/schemi-codifica.service';
import { SchemiCodificaRegoleService } from '../_services/schemi-codifica-regole.service';
import { AlertService } from '../_services/alert.service';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-schemi-codifica-form',
  templateUrl: './schemi-codifica-form.component.html',
  styleUrls: ['./schemi-codifica-form.component.css']
})
export class SchemiCodificaFormComponent implements OnInit {
  header: string = '';
  selectedSchemaType: string = '';
  types: any[]= [
    { label: 'Testo', value: 'text' },
    { label: 'Numero', value: 'number' },
    { label: 'Elenco', value: 'elenco' },
    { label: 'Sottoschema', value: 'sottoschema' }];
  currentSection: number = 1;
  typeSelected: string ='Tipo';
  schemaOptionsList: SchemaCodificaOptions[] = [];
  elencoOptionsSelected: string = '';
  sottoschemaOptionsSelected: string = '';
  newRuleFormOpened: boolean = true;
  id: number = -1;

  schemaCodificaForm = {
    ID_SCHEMA: -1,
    TITOLO: '',
    DESCRIZIONE: '',
    TIPOLOGIA: '',
    TPL_CODICE: '',
    TPL_DESCRIZIONE: '',
    PRE_RENDER_JS: '',
    IS_VALID: '',
    NOTE_INTERNE: ''
  };

  schemaCodificaRegole2: SchemaCodificaRegole[] = [];

  nuovaRegola!: SchemaCodificaRegole;

  isAddRuleActive: boolean = false;

  @ViewChild('regole') regoleTable?: MatTable<SchemaCodificaRegole>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    public fb: FormBuilder,
    public schemaCodificaService: SchemiCodificaService,
    public schemiCodificaRegoleService: SchemiCodificaRegoleService,
    public schemiCodificaOpzioniService: SchemiCodificaOpzioniService
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params.id; // uguale a const id = params.id
      this.header = this.id ? 'Modifica Schema: ' + this.id : 'Nuovo Schema';
    });
    if (this.id > 0) {
      this.getRegoleEsistenti(this.id);
      this.getSchemaEsistente(this.id);
    }
  }

  getSchemaEsistente(id: number): void {
    this.schemaCodificaService.getById(id)
      .subscribe(
        response => {
          this.schemaCodificaForm = response.value;
          console.log(this.schemaCodificaForm);
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

  onChangeValid(event: MatCheckboxChange) {
    this.schemaCodificaForm.IS_VALID = event.source.checked ? 'Y' : 'N';
  }

  updateSchema() {
    this.schemaCodificaService.update(this.schemaCodificaForm)
      .subscribe(
        response => {
          this.alertService.success('Schema aggiornato con successo!');
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

  addSchema() {
    this.schemaCodificaService.create(this.schemaCodificaForm)
      .subscribe(
        response => {
          this.alertService.success('Schema creato con successo!');
          this.schemaCodificaForm = response.value;
          this.id = this.schemaCodificaForm.ID_SCHEMA;
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

  getRegoleEsistenti(id: number): void {
    this.schemiCodificaRegoleService.getAll(id)
      .subscribe(
        response => {
          this.schemaCodificaRegole2 = response.data;
          this.newRuleFormOpened = !(response.data.length > 0);
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

  openNewRuleForm(): void {
    this.newRuleFormOpened = true;
    this.nuovaRegola = {
      ID_SCHEMA: this.schemaCodificaForm.ID_SCHEMA,
      NOM_VARIABILE: '',
      ORD_PRESENTAZIONE: 1,
      ETICHETTA: '',
      REQUIRED: 'N',
      TIPO: 'text',
      MAXLENGTH: null,
      PATTERN_REGEXP: null,
      NUM_DECIMALI: null,
      MIN: null,
      MAX: null,
      OPTIONS: [],
      SOTTOSCHEMI: []
    }
  }

  refreshRegole() {
    this.newRuleFormOpened = false;
    this.getRegoleEsistenti(this.id);
  }
}
