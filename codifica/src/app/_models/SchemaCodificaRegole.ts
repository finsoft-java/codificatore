import { SchemaCodificaOptions } from './SchemaCodificaOptions';

export interface SchemaCodificaRegole {
  ID_SCHEMA: number;
  NOM_VARIABILE: string;
  ORD_PRESENTAZIONE: number;
  ETICHETTA: string;
  REQUIRED: string;
  TIPO: string;
  MAXLENGTH: number | null;
  PATTERN_REGEXP: string | null;
  NUM_DECIMALI: number | null;
  MIN: number | null;
  MAX: number | null;
  OPTIONS?: SchemaCodificaOptions[];
  SOTTOSCHEMI?: {ID_SCHEMA: number, TITOLO: string}[];
}
