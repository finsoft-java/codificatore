import { SchemaCodifica } from './SchemaCodifica';
import { SchemaCodificaOptions } from './SchemaCodificaOptions';

export interface SchemaCodificaRegole {
  ID_SCHEMA: number;
  NOM_VARIABILE: string;
  ORD_PRESENTAZIONE: number;
  ETICHETTA: string;
  REQUIRED: string;
  TIPO: string;
  MAXLENGTH: number;
  PATTERN_REGEXP: string;
  NUM_DECIMALI: number;
  MIN: number;
  MAX: number;
  OPTIONS?: SchemaCodificaOptions[];
  SOTTOSCHEMI?: {ID_SCHEMA: number, TITOLO: string}[];
}
