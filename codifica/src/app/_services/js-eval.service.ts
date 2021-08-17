import { Injectable } from '@angular/core';
import { IHash } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class JsEvalService {

  constructor() { }

  
  /**
   * Compone una stringa template con i parametri presenti in this.parametri
   * @param template es. "Hello {{name.toUpperCase()}}!"
   * @param parametri es. {name:'Goofy'}
   * @param jsPrerender es. "name = 'Mr. ' + name"
   * @returns rendered template es. "Hello MR. GOOFY"
   */
   componi(template: string, parametri: IHash, jsPrerender?: string): string {
    if (!template) return '';

    const matches = template.match(/{{[^}]*}}/g);
    console.log('Compongo il codice (o la descrizione) con questi parametri:', parametri);

    let finalResult = template;
    if (matches != null) {
      let [parametriObj, parametriStr] = this.splitParameters(parametri);
      matches.forEach(mustache => {

        // A ogni ciclo, sostituisco un {{mustache}} con il suo valore calcolato

        let formula = '';
        parametriObj.forEach(paramName => {
          formula += `var ${paramName}={};`;
        });
        parametriStr.forEach(paramName => {
          formula += `var ${paramName}='${parametri[paramName]}';`;
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

  /**
   * Divide i parametri tra stringhe e oggetti
   * Es. un parametr si chiama aa.bb.cc
   * assumo che aa e bb siano oggetti, mentre cc sia una stringa
   */
  splitParameters (parametri: IHash) {
    let parametriObj: string[] = [];
    let parametriStr: string[] = [];
    Object.keys(parametri).forEach(paramName => {
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
   * Divide una stringa (dot-notation) in token, separando l'ultimo livello dagli altri
   * Es. dato 'aaa.bbb.ccc' restituisce [['aaa','bbb'],['ccc']]]
  */
  splitParameter(paramName: string) {
    let tokens = paramName.split('.');
    if (tokens.length == 1) {
      return [[], [paramName]];
    } else {
      return [tokens, [tokens.pop()]];
    }
  }

}
