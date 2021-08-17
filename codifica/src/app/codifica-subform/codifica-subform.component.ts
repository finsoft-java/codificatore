/* eslint-disable no-eval */
import { ThisReceiver } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
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
    private jsEvalService: JsEvalService) { }

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

  schema?: SchemaCodifica;
  regole: SchemaCodificaRegole[] = [];
  schemi: SchemaCodifica[] = [];
  parametri: IHash = {};
  codiceCalcolato = '';
  descrizioneCalcolata = '';
  parametriSottoSchemi: IHash[] = [];
  parametriObbligatoriSettati = false;

  ngOnInit(): void {
    // Carico lo schema (ma serve??)
    this.svcSchemi.getById(this.idSchema).subscribe(response => {
      this.schema = response.value;
    });
    // Carico le regole
    this.regoleSvc.getAll(this.idSchema).subscribe(response => {
      this.regole = response.data;
      this.regole.forEach(r => {
        if (r.TIPO === 'sottoschema') {
          this.parametri[r.NOM_VARIABILE + '.id'] = '';
          this.parametri[r.NOM_VARIABILE + '.codice'] = '';
          this.parametri[r.NOM_VARIABILE + '.descrizione'] = '';
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
    this.parametri[nomVariabile] = (<HTMLInputElement>evt.target).value;
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

    this.codiceCalcolato = this.jsEvalService.componi(this.schema!.TPL_CODICE, this.parametri, this.schema!.PRE_RENDER_JS);
    this.descrizioneCalcolata = this.jsEvalService.componi(this.schema!.TPL_DESCRIZIONE, this.parametri, this.schema!.PRE_RENDER_JS);

    this.changeCodice.emit(this.codiceCalcolato);
    this.changeDescrizione.emit(this.descrizioneCalcolata);

    const datiCodifica = [];
    // clone preserving indexes
    this.parametriSottoSchemi.forEach((x, i) => { datiCodifica[i] = x; });
    datiCodifica[this.idSchema] = this.parametri;

    this.changeDatiCodifica.emit(datiCodifica);
  }

  controllaRegoleObbligatorie() {
    const missing = this.regole.filter(x => x.REQUIRED == 'Y').find(x => {
      const value = this.parametri[x.NOM_VARIABILE];
      return (value === undefined || value == null || value == '');
    });
    this.parametriObbligatoriSettati = !missing;
    this.changeParametriObbligatoriSettati.emit(this.parametriObbligatoriSettati);
  }

  changeParametriObbligatoriSottoschemi(nomVariabile: string, $event: boolean) {
    // TODO
    console.log("Should recheck ParametriRquired", $event);
  }
}
