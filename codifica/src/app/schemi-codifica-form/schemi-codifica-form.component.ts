import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SchemaCodifica, SchemaCodificaOptions, SchemaCodificaRegole } from '../_models';
import { SchemiCodificaOpzioniService } from '../_services/schemi-codifica-opzioni.service';
import { SchemiCodificaService } from '../_services/schemi-codifica.service';
import { SchemiCodificaRegoleService } from '../_services/schemi-codifica-regole.service';
import { AlertService } from '../_services/alert.service';
import { MatTable } from '@angular/material/table';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  newRuleFormOpened: boolean = false;
  scegliRegoleGlobali: boolean = false;
  regoleGlobali: SchemaCodificaRegole[] = [];
  id: number = -1;
  selectedImage: any;
  regolaGlobaleSelected: any;

  schemaCodificaForm: SchemaCodifica = {
    ID_SCHEMA: -1,
    TITOLO: '',
    DESCRIZIONE: '',
    TIPOLOGIA: '',
    TPL_CODICE: null,
    TPL_DESCRIZIONE: null,
    PRE_RENDER_JS: null,
    IS_VALID: 'N',
    NOTE_INTERNE: null,
    IMMAGINE_B64: null
  };
  schemaCodificaRegole2: SchemaCodificaRegole[] = [];
  nuovaRegola!: SchemaCodificaRegole;
  isAddRuleActive: boolean = false;
  imageSrc: SafeResourceUrl|null = null;

  constructor(
    private route: ActivatedRoute,
    private alertService: AlertService,
    public fb: FormBuilder,
    public schemaCodificaService: SchemiCodificaService,
    public schemiCodificaRegoleService: SchemiCodificaRegoleService,
    public schemiCodificaOpzioniService: SchemiCodificaOpzioniService,
    private _sanitizer: DomSanitizer
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
          this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,' + this.schemaCodificaForm.IMMAGINE_B64);
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
    const maxOrd = Math.max(...this.schemaCodificaRegole2.map(x => x.ORD_PRESENTAZIONE));
    const newOrd = Math.floor(maxOrd / 10) * 10 + 10;

    this.nuovaRegola = {
      ID_SCHEMA: this.schemaCodificaForm.ID_SCHEMA,
      ID_REGOLA: -1, // deve essere settato server-side
      NOM_VARIABILE: '',
      GLOBAL: 'N',
      ORD_PRESENTAZIONE: newOrd,
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
    this.scegliRegoleGlobali = false;
    this.newRuleFormOpened = true;
  }

  openNewRuleGlobaleForm(): void {
    this.openNewRuleForm();
    this.nuovaRegola.GLOBAL = 'Y';
  }

  openNewRuleFormScegliGlobale(): void {
    this.openNewRuleGlobaleForm();
    this.scegliRegoleGlobali = true;
    this.schemiCodificaRegoleService.getAllGlobali().subscribe(response => {
      this.regoleGlobali = response.data;
    });
  }

  refreshRegole() {
    console.log('Refresh required');
    this.newRuleFormOpened = false;
    this.getRegoleEsistenti(this.id);
  }

  creaRegolaDaGlobale() {
    let r = this.regoleGlobali.find(x => x.ID_REGOLA == this.regolaGlobaleSelected);
    if (r) {
      this.openNewRuleGlobaleForm();
      this.nuovaRegola.ID_REGOLA = r.ID_REGOLA;
      this.nuovaRegola.NOM_VARIABILE = r.NOM_VARIABILE;
      this.nuovaRegola.ETICHETTA = r.ETICHETTA;
      this.nuovaRegola.REQUIRED = r.REQUIRED;
      this.nuovaRegola.TIPO = r.TIPO;
      this.nuovaRegola.MAXLENGTH = r.MAXLENGTH;
      this.nuovaRegola.PATTERN_REGEXP = r.PATTERN_REGEXP;
      this.nuovaRegola.NUM_DECIMALI = r.NUM_DECIMALI;
      this.nuovaRegola.MIN = r.MIN;
      this.nuovaRegola.MAX = r.MAX;
      this.nuovaRegola.OPTIONS = r.OPTIONS;
      this.nuovaRegola.SOTTOSCHEMI = r.SOTTOSCHEMI;
    }
  }

  uploadImage(event: any) {
    console.log(event);
    this.selectedImage = event.target.files && event.target.files[0];
    console.log(this.selectedImage);
    if (this.selectedImage) {
      this.schemaCodificaService.uploadImage(this.id, this.selectedImage).subscribe(response => {
        this.getSchemaEsistente(this.id);
      });
    }

    /*
    const file: File = event.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {

      this.selectedFile = new ImageSnippet(event.target.result, file);

      this.imageService.uploadImage(this.selectedFile.file).subscribe(
        (res) => {
        
        },
        (err) => {
        
        })
    });

    reader.readAsDataURL(file);*/
  }

  deleteImage() {
    // TODO Some warning?
    this.schemaCodificaService.deleteImage(this.id).subscribe(response => {
      this.getSchemaEsistente(this.id);
    });
  }

  hasImage(): boolean {
    return this.schemaCodificaForm && this.schemaCodificaForm.IMMAGINE_B64 != null;
  }
}
