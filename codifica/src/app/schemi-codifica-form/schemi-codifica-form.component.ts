import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SchemaCodificaOptions, SchemaCodificaRegole } from '../_models';
import { SchemiCodificaOpzioniService } from '../_services/schemi-codifica-opzioni.service';
import { SchemiCodificaService } from '../_services/schemi-codifica.service';
import { SchemiCodificaRegoleService } from '../_services/schemi-codifica-regole.service';
import { AlertService } from '../_services/alert.service';

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

  schemaCodificaForm = this.fb.group({
    ID_SCHEMA: [-1, [Validators.required]],
    TITOLO: ['', [Validators.required]],
    DESCRIZIONE: '',
    TIPOLOGIA: ['', [Validators.required]],
    TPL_CODICE: ['', [Validators.required]],
    TPL_DESCRIZIONE: ['', [Validators.required]],
    PRE_RENDER_JS: ['', [Validators.required]],
    IS_VALID: ['', [Validators.required]],
    NOTE_INTERNE: ''
  });

  schemaCodificaRegole2: SchemaCodificaRegole[] = [];

  schemaCodificaRegole: FormGroup = this.fb.group({ regole: [] });

  parsingRules = this.fb.group({
    ID_SCHEMA: [-1, [Validators.required]],
    NOM_VARIABILE: '',
    ORD_PRESENTAZIONE: '',
    ETICHETTA: '',
    REQUIRED: '',
    TIPO: 'Tipo',
    MAXLENGTH: -1,
    PATTERN_REGEXP: '',
    NUM_DECIMALI: 0,
    MIN: 0,
    MAX: 0
  });

  get f1() { return this.schemaCodificaForm.controls; }

  get f2() { return this.parsingRules.controls; }

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
    }
  }

  getRegoleEsistenti(id: number): void {
    this.schemiCodificaRegoleService.getAll(id)
      .subscribe(
        response => {
          this.schemaCodificaRegole2 = response.data;
          this.schemaCodificaRegole = this.fb.group({ regole: response.data });
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

  logForm(): void {
    console.log(this.schemaCodificaForm.controls);
  }

  openNewRuleForm(): void {
    this.newRuleFormOpened = true;
  }
}
