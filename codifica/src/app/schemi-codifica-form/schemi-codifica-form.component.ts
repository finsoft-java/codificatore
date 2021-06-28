import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
  types: String[]= ['Tipo', 'Numero', 'Testo', 'Elenco', 'Sottoschema', 'Case'];
  currentSection: number = 1;
  typeSelected: string ='Tipo';
  elencoOptionsSelected: string = '';
  sottoschemaOptionsSelected: string = '';
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
  schemaCodificaRegole: SchemaCodificaRegole[]= [];

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
    public schemiCodificaRegoleService: SchemiCodificaRegoleService)
  {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const { id } = params; // uguale a const id = params.id
      this.header = id ? 'Modifica Schema: ' + id : 'Nuovo Schema';
    });
    this.getRegoleEsistenti();
  }

  getRegoleEsistenti(): void {
    this.schemiCodificaRegoleService.getAll()
      .subscribe(
        data => {
          this.schemaCodificaRegole = data.data;
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
}
