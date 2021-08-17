/* eslint-disable no-eval */
import { ThisReceiver } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { IHash, SchemaCodifica, SchemaCodificaRegole } from '../_models';
import { SchemiCodificaRegoleService } from '../_services/schemi-codifica-regole.service';
import { SchemiCodificaService } from '../_services/schemi-codifica.service';

@Component({
  selector: 'app-codifica-subform',
  templateUrl: './codifica-subform.component.html',
  styleUrls: ['./codifica-subform.component.css']
})
export class CodificaSubformComponent implements OnInit {
  constructor(private svcSchemi: SchemiCodificaService,
    private regoleSvc: SchemiCodificaRegoleService) { }

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

  /**
   * Compone una stringa template con i parametri presenti in this.parametri
   * @returns rendered template
   */
  componi(template: string): string {
    if (!template) return '';

    const matches = template.match(/{{[^}]*}}/g);
    console.log('Compongo il codice (o la descrizione) con questi parametri:', this.parametri);

    let result = template;
    if (matches != null) {
      matches.forEach(m => {
        let [parametriObj, parametriStr] = this.splitParameters();
        let formula = '';
        parametriObj.forEach(paramName => {
          formula += `var ${paramName}={};`;
        });
        parametriStr.forEach(paramName => {
          formula += `var ${paramName}='${this.parametri[paramName]}';`;
        });
        // FIXME qui dovrei applicare la pre-render formula!!!
        formula += m.substring(2, m.length - 2);
        console.log('Going to evaluate: ' + formula);
        const repl = eval(formula);
        result = result.replace(m, repl || '');
      });
    }

    return result;
  }

  /**
   * Divide i parametri tra stringhe e oggetti
  */
  splitParameters () {
    let parametriObj: string[] = [];
    let parametriStr: string[] = [];
    Object.keys(this.parametri).forEach(paramName => {
      let [parametriObj1, parametriStr1] = this.splitParameter(paramName);
      parametriObj1.forEach(element => {
        if ((element !== undefined) && !(element in parametriObj)) {
          parametriObj.push(element);
        }
      });
      parametriStr1.forEach(element => {
        if ((element !== undefined) && !(element in parametriStr)) {
          parametriStr.push(element);
        }
      });
    });
    return [parametriObj, parametriStr];
  }

  /**
   * Divide i parametri tra stringhe e oggetti
   * Dato 'aaa.bbb.ccc' restituisce [['aaa','bbb'],['ccc']]]
  */
  splitParameter(paramName: string) {
    let tokens = paramName.split('.');
    if (tokens.length == 1) {
      return [[], [paramName]];
    } else {
      return [tokens, [tokens.pop()]];
    }
  }

  componiCodiceDescrizione() {
    if (!this.schema) return;

    this.codiceCalcolato = this.componi(this.schema!.TPL_CODICE);
    this.descrizioneCalcolata = this.componi(this.schema!.TPL_DESCRIZIONE);

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
