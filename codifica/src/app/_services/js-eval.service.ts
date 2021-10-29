import { Injectable } from '@angular/core';
import { IHash } from '../_models';

@Injectable({ providedIn: 'root' })
export class JsEvalService {
  constructor() { }

  /**
   * Compone una stringa template con i parametri presenti in this.parametri
   * @param template es. "Hello {{name.toUpperCase()}}!"
   * @param parametri es. {name:'Goofy'}
   * @param jsPrerender es. "name = 'Mr. ' + name"
   * @returns rendered template es. "Hello MR. GOOFY"
   */
  componi(template: string, parametri: IHash, jsPrerender?: string|null): string {
    if (!template) return '';

    const matches = template.match(/{{[^}]*}}/g);
    console.log('Compongo il codice/la descrizione con questi parametri:', parametri);

    let finalResult = template;
    if (matches != null) {
      let [stringhe, oggetti, attributi] = this.splitParameters(parametri);
      matches.forEach(mustache => {
        // A ogni ciclo, sostituisco un {{mustache}} con il suo valore calcolato

        let formula = '';
        oggetti.forEach(paramName => {
          formula += `var ${paramName}={};`;
        });
        attributi.forEach(paramName => {
          let paramValue = this.escapeParamValue(parametri[paramName]);
          formula += `${paramName}=${paramValue};`;
        });
        stringhe.forEach(paramName => {
          let paramValue = this.escapeParamValue(parametri[paramName]);
          formula += `var ${paramName}=${paramValue};`;
        });

        if (jsPrerender) {
          formula += jsPrerender;
          formula += ';';
        }

        formula += mustache.substring(2, mustache.length - 2);
        console.log('Going to evaluate: ' + formula);
        const mustacheEvaluated = eval(formula);
        finalResult = finalResult.replace(mustache, mustacheEvaluated || '');
      });
    }
    return finalResult;
  }

  escapeParamValue(value: any): string {
    if (value === undefined) {
      return 'undefined';
    }
    if (value === null) {
      return 'null';
    }
    if (typeof (value) === 'number') {
      return '' + value;
    }
    return "'" + value.replace("\r", "").replace("\n", "").replace("\\", "\\\\").replace("'", "\\'") + "'";
  }

  /**
   * Restituisce tre liste: le variabili string, gli oggetti, gli attributi string
   */
  splitParameters(parametri: IHash) {
    let stringhe: string[] = [];
    let oggetti: string[] = [];
    let attributi: string[] = [];
    Object.keys(parametri).forEach(paramName => {
      let [stringhe1, oggetti1, attributi1] = this.getAllParameters(paramName);
      this.addAllIfNotPresent(oggetti1, oggetti);
      this.addAllIfNotPresent(attributi1, attributi);
      this.addAllIfNotPresent(stringhe1, stringhe);
    });
    return [stringhe, oggetti, attributi];
  }

  addAllIfNotPresent(src: any[], dest: any[]) {
    src.forEach(x => this.addIfNotPresent(x, dest));
  }

  addIfNotPresent(x: any, list: any[]) {
    if ((x !== undefined) && !(x in list)) {
      list.push(x);
    }
  }

  /**
   * Data una stringa, restituisce tre liste: le variabili string, gli oggetti, gli attributi string.
   * Ad esempio, per 'aaa' restituisce [['aaa'],[],[]] perchè è una variabile semplice;
   * per 'aa.bb.cc' restituisce [[],['aa','aa.bb'],['aa.bb.cc]]
   * @param paramName
   */
  getAllParameters(paramName: string) {
    if (!paramName.includes('.')) {
      return [[paramName], [], []];
    }
    let idx = 0;
    let objects = [];
    while ((idx = paramName.indexOf('.', idx)) >= 0) {
      objects.push(paramName.substr(0, idx));
      ++idx;
    }
    return [[], objects, [paramName]];
  }
}
