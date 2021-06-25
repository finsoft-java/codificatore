<?php

$schemiManager = new SchemiManager();

class SchemiManager {
    
    function getAll() {
        $sql0 = "SELECT COUNT(*) AS cnt ";
        $sql1 = "SELECT * ";
        $sql = "FROM schemi_codifica x ";

        $sql .= " ORDER BY x.titolo";
        $count = select_single_value($sql0 . $sql);
        $objects = select_list($sql1 . $sql);        
        return [$objects, $count];
    }
    
    function getById($id_schema) {
        $sql = "SELECT * FROM schemi_codifica x WHERE x.id_schema=$id_schema ";
        return select_single($sql);
    }

    function crea($json_data) {

        $sql = insert("schemi_codifica", ["ID_SCHEMA" => null, // AUTO_INCREMENT
                                "TITOLO" => $con->escape_string($json_data->TITOLO),
                                "DESCRIZIONE" => $con->escape_string($json_data->DESCRIZIONE),
                                "TIPOLOGIA" => $con->escape_string($json_data->TIPOLOGIA),
                                "TPL_CODICE" => $con->escape_string($json_data->TPL_CODICE),
                                "TPL_DESCRIZIONE" => $con->escape_string($json_data->TPL_DESCRIZIONE),
                                "PRE_RENDER_JS" => $con->escape_string($json_data->PRE_RENDER_JS),
                                "IS_VALID" => $con->escape_string($json_data->IS_VALID),
                                "NOTE_INTERNE" => $con->escape_string($json_data->NOTE_INTERNE)
                                ]);
        // L'immagine va aggiornata a parte
        execute_update($sql);
        return $this->getById($json_data->ID_SCHEMA);
    }
    
    function aggiorna($json_data) {     
        
        $sql = update("schemi_codifica", ["TITOLO" => $con->escape_string($json_data->TITOLO),
                                "DESCRIZIONE" => $con->escape_string($json_data->DESCRIZIONE),
                                "TIPOLOGIA" => $con->escape_string($json_data->TIPOLOGIA),
                                "TPL_CODICE" => $con->escape_string($json_data->TPL_CODICE),
                                "TPL_DESCRIZIONE" => $con->escape_string($json_data->TPL_DESCRIZIONE),
                                "PRE_RENDER_JS" => $con->escape_string($json_data->PRE_RENDER_JS),
                                "IS_VALID" => $con->escape_string($json_data->IS_VALID),
                                "NOTE_INTERNE" => $con->escape_string($json_data->NOTE_INTERNE)], 
                               ["ID_SCHEMA" => $json_data->ID_SCHEMA]);
        execute_update($sql);
    }

    function elimina($idSchema) {
        $sql = "DELETE FROM schemi_codifica WHERE ID_SCHEMA = $idSchema";
        execute_update($sql);
    }
}
?>