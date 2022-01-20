/* eslint-disable no-eval */
import { ThisReceiver } from '@angular/compiler';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IHash, SchemaCodifica, SchemaCodificaRegole } from '../_models';
import { JsEvalService } from '../_services/js-eval.service';
import { SchemiCodificaRegoleService } from '../_services/schemi-codifica-regole.service';
import { SchemiCodificaService } from '../_services/schemi-codifica.service';

@Component({
  selector: 'app-codifica-subform',
  templateUrl: './codifica-subform.component.html',
  styleUrls: ['./codifica-subform.component.css']
})
export class CodificaSubformComponent implements OnInit {
  constructor(private svcSchemi: SchemiCodificaService,
    private regoleSvc: SchemiCodificaRegoleService,
    private jsEvalService: JsEvalService,
    private _sanitizer: DomSanitizer) { }

  @Input()
  idSchema!: number;
  @Input()
  soloSchemiInterni = true;
  @Input()
  considerRequired = true;

  @Output()
  changeCodice: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  changeDescrizione: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  changeDatiCodifica: EventEmitter<IHash[]> = new EventEmitter<IHash[]>();
  @Output()
  changeParametriObbligatoriSettati: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  errorEmitter: EventEmitter<string> = new EventEmitter<string>();

  schema?: SchemaCodifica;
  regole: SchemaCodificaRegole[] = [];
  schemi: SchemaCodifica[] = [];
  parametri: IHash = {};
  codiceCalcolato = '';
  descrizioneCalcolata = '';
  parametriSottoSchemi: IHash[] = [];
  parametriObbligatoriSettati = false;
  parametriObbligatoriSottoschemiSettati = true;
  parametriNonValidi: string[] = [];
  imageSrc: SafeResourceUrl|null = null;

  ngOnInit(): void {
    // Carico lo schema (ma serve??)
    this.svcSchemi.getById(this.idSchema).subscribe(response => {
      this.schema = response.value;
      if (this.schema) {
        console.log('dentro if');
        this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,' + this.schema.IMMAGINE_B64);
      }
    });
    // Carico le regole
    this.regoleSvc.getAll(this.idSchema).subscribe(response => {
      this.regole = response.data;
      this.regole.forEach(r => {
        if (r.TIPO === 'sottoschema') {
          this.parametri[r.NOM_VARIABILE + '.id'] = '';
          this.parametri[r.NOM_VARIABILE + '.codice'] = '';
          this.parametri[r.NOM_VARIABILE + '.descrizione'] = '';
          this.parametriObbligatoriSottoschemiSettati = false; //setto a false in quanto non so se i figli avranno proprietà obbligatorie
        } else {
          this.parametri[r.NOM_VARIABILE] = '';
        }
      });
    });
    // Carico gli schemi interni (in realtà servono solo
    // se ci sono delle regole con sottoschema)
    if (this.soloSchemiInterni) {
      this.svcSchemi.getValidiInterni().subscribe(response => {
        this.schemi = response.data;
      });
    } else {
      // solo i pubblici: ok??
      this.svcSchemi.getValidiPubblici().subscribe(response => {
        this.schemi = response.data;
      });
    }
  }

  onChangeInputRule(nomVariabile: string, evt: Event) {
    const element = <HTMLInputElement>evt.target;
    this.checkValidity(evt);
    this.parametri[nomVariabile] = element.value;
    this.controllaRegoleObbligatorie();
    this.componiCodiceDescrizione();
  }

  onChangeSelectRule(nomVariabile: string, evt: MatSelectChange) {
    this.parametri[nomVariabile] = evt.value;
    this.controllaRegoleObbligatorie();
    this.componiCodiceDescrizione();
  }

  onChangeSottoschema(nomVariabile: string, evt: MatSelectChange) {
    this.parametri[nomVariabile + '.id'] = null; // forse destroy subform
    this.parametri[nomVariabile + '.id'] = evt.value;
    this.controllaRegoleObbligatorie();
    this.componiCodiceDescrizione();
  }

  /**
   * @param nomVariabileFull nomVariabile.nomesottovariabile (codice o descrizione)
   */
  onChangeVariabileSottoschema(nomVariabile: string, nomSottoVariabile: string, evt: string) {
    this.parametri[nomVariabile + '.' + nomSottoVariabile] = evt;
    this.componiCodiceDescrizione();
    this.controllaRegoleObbligatorie();
  }

  parseInt(s: string) {
    return Number(s);
  }

  componiCodiceDescrizione() {
    if (!this.schema) return;

    if (this.schema.TPL_CODICE) {
      try {
        this.codiceCalcolato = this.jsEvalService.componi(this.schema.TPL_CODICE, this.parametri, this.schema.PRE_RENDER_JS);
      } catch (exc: any) {
        this.showError('Errore nel calcolo del codice: ' + exc.message);
      }
    }
    if (this.schema.TPL_DESCRIZIONE) {
      try {
        this.descrizioneCalcolata = this.jsEvalService.componi(this.schema.TPL_DESCRIZIONE, this.parametri, this.schema.PRE_RENDER_JS);
      } catch (exc: any) {
        this.showError('Errore nel calcolo della descrizione: ' + exc.message);
      }
    }

    this.changeCodice.emit(this.codiceCalcolato);
    this.changeDescrizione.emit(this.descrizioneCalcolata);

    const datiCodifica = [];
    // clone preserving indexes
    this.parametriSottoSchemi.forEach((x, i) => { datiCodifica[i] = x; });
    datiCodifica[this.idSchema] = this.parametri;

    this.changeDatiCodifica.emit(datiCodifica);
  }

  controllaRegoleObbligatorie() {
    const missing = this.regole.filter(x => x.REQUIRED === 'Y').find(x => {
      const value = this.parametri[x.NOM_VARIABILE];
      return (x.TIPO !== 'sottoschema' && (value === undefined || value == null || value === ''));
    });
    this.parametriObbligatoriSettati = !missing && this.parametriNonValidi.length === 0;
    console.log("COMPONENT: ", this);
    console.log(!missing?"primo a true":"primo a false");
    console.log(this.parametriNonValidi.length === 0?"secondo a true":"secondo a false");
    console.log(this.parametriNonValidi);
    this.changeParametriObbligatoriSettati.emit(this.parametriObbligatoriSettati && this.parametriObbligatoriSottoschemiSettati);
  }

  changeParametriObbligatoriSottoschemi($event: boolean) {
    this.parametriObbligatoriSottoschemiSettati = $event;
  }

  checkValidity(event: Event) {
    const element = <HTMLInputElement>event.target;
    if (element) {
      if (!this.isInputValid(element)) {
        element.setCustomValidity('Valore inserito non corretto!');
        element.reportValidity();
        if (this.parametriNonValidi.indexOf(element.name) < 0) {
          this.parametriNonValidi.push(element.name);
        }
      }
      else {
        element.setCustomValidity('');
        if (this.parametriNonValidi.indexOf(element.name) >= 0) {
          this.parametriNonValidi.splice(this.parametriNonValidi.indexOf(element.name), 1);
        }
      }
    }
  }

  highlightInputIfInvalid(event: Event) {
    const element = <HTMLInputElement>event.target;
    if (element) {
      // HTML5 E' BALORDO E MI RITORNA NULL COME STRINGA
      if (!this.isInputValid(element)) {
        element.parentElement?.parentElement?.classList.add('invalid-field');
      }
      else {
        element.parentElement?.parentElement?.classList.remove('invalid-field');
      }
    }
  }

  isInputValid(element: HTMLInputElement) {
    // HTML5 E' BALORDO E MI RITORNA NULL COME STRINGA 
    if (element.validity.patternMismatch && element.pattern !== null && element.pattern !== 'null') {
      return false;
    }
    return true;
  }

  showError(error: string) {
    this.errorEmitter.emit(error);
  }

  hasImage(): boolean {
    return typeof this.schema !== 'undefined' && this.schema
            && this.schema.IMMAGINE_B64 != null && this.schema.IMMAGINE_B64.length > 0;
  }
}
