export interface SchemaCodifica {
  ID_SCHEMA: number;
  TITOLO: string;
  DESCRIZIONE: string;
  TIPOLOGIA: string;
  TPL_CODICE: string|null;
  TPL_DESCRIZIONE: string|null;
  PRE_RENDER_JS: string|null;
  IS_VALID: string;
  NOTE_INTERNE: string|null;
  IMMAGINE_B64: string|null;
}
