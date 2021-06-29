INSERT INTO `schemi_codifica` (`TITOLO`, `DESCRIZIONE`, `TIPOLOGIA`, `TPL_CODICE`, `TPL_DESCRIZIONE`, `PRE_RENDER_JS`, `IS_VALID`, `IMMAGINE`, `NOTE_INTERNE`) VALUES
('prova', 'prova', 'P', 'xxx', 'yyy', NULL, 'Y', NULL, NULL),
('prova2', 'prova2', 'P', 'xxx', 'yyy', NULL, 'Y', NULL, NULL);

INSERT INTO `schemi_regole` (`ID_SCHEMA`, `NOM_VARIABILE`, `ORD_PRESENTAZIONE`, `ETICHETTA`, `REQUIRED`, `TIPO`, `MAXLENGTH`, `PATTERN_REGEXP`, `NUM_DECIMALI`, `MIN`, `MAX`) VALUES
(1, 'AGE', 2, 'Età', 'Y', 'number', NULL, NULL, NULL, 14, NULL),
(1, 'capelli', 3, 'Colore dei capelli', 'n', 'elenco', NULL, NULL, NULL, NULL, NULL),
(1, 'NOME', 1, 'Un nome', 'Y', 'text', 20, NULL, NULL, NULL, NULL);

INSERT INTO `schemi_options` (`ID_SCHEMA`, `NOM_VARIABILE`, `VALUE_OPTION`, `ETICHETTA`) VALUES
(1, 'capelli', '1', 'Biondi'),
(1, 'capelli', '2', 'Castani'),
(1, 'capelli', '3', 'Neri'),
(1, 'capelli', '4', 'Viola');

COMMIT;