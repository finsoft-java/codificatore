import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SchemaCodificaRegole } from '../_models';
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
    { label: 'Tipo', value: '' },
    { label: 'Numero', value: 'number' },
    { label: 'Testo', value: 'text' },
    { label: 'Elenco', value: 'elenco' },
    { label: 'Sottoschema', value: ' sottoschema' },
    { label: 'Case', value: 'case' }];
  currentSection: number = 1;
  typeSelected: string ='Tipo';
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

  schemaCodificaRegole: FormGroup = this.fb.group({
    test: 'lala',
    regole: this.fb.array([])
  });

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

  get regole() {
    return this.schemaCodificaRegole.get('regole') as FormArray;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    public fb: FormBuilder,
    public schemaCodificaService: SchemiCodificaService,
    public schemiCodificaRegoleService: SchemiCodificaRegoleService
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params.id; // uguale a const id = params.id
      this.header = this.id ? 'Modifica Schema: ' + this.id : 'Nuovo Schema';
    });
    if (this.id > 0) this.getRegoleEsistenti(this.id);
  }

  getRegoleEsistenti(id: number): void {
    this.schemiCodificaRegoleService.getAll(id)
      .subscribe(
        data => {
          const rules: FormGroup[] = data.data.map(rule => this.fb.group(rule));
          this.schemaCodificaRegole = this.fb.group({ regole: this.fb.array(rules) });
          this.newRuleFormOpened = !(data.data.length > 0);
          console.log(this.schemaCodificaRegole);
        },
        error => {
          if (error.status === 401 || error.status === 403) {
            this.alertService.error('Errore del Server');
          } else {
            // Ad esempio: Impossibile conettersi al server PHP
            this.alertService.error(error);
          }
          //this.loading = false;
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
