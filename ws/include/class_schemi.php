<?php

$schemiManager = new SchemiManager();

class SchemiManager {
    
    function getAll($soloValidi=false, $tipo=null) {
        $sql0 = "SELECT COUNT(*) AS cnt ";

        //devo escludere il campo BLOB
        $sql1 = "SELECT ID_SCHEMA,TITOLO,DESCRIZIONE,TIPOLOGIA,TPL_CODICE,TPL_DESCRIZIONE,PRE_RENDER_JS,IS_VALID,NOTE_INTERNE ";
        $sql = "FROM schemi_codifica x WHERE 1=1 ";
        if ($soloValidi) {
            $sql .= "AND IS_VALID='Y' ";
        }
        if ($tipo) {
            $sql .= "AND TIPOLOGIA='$tipo' ";
        }
        $sql .= "ORDER BY x.titolo";
        $count = select_single_value($sql0 . $sql);
        $objects = select_list($sql1 . $sql);        
        return [$objects, $count];
    }
    
    function getById($id_schema) {

        // converto il campo BLOB in b64
        $sql = "SELECT ID_SCHEMA,TITOLO,DESCRIZIONE,TIPOLOGIA,TPL_CODICE,TPL_DESCRIZIONE,PRE_RENDER_JS,IS_VALID,NOTE_INTERNE," .
            "TO_BASE64(IMMAGINE) AS IMMAGINE_B64 " .
            "FROM schemi_codifica x WHERE x.id_schema=$id_schema ";
        return select_single($sql);
    }

    function crea($json_data) {
        global $con;
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
        $idCodifica = $con->insert_id;
        return $this->getById($idCodifica);
    }
    
    function aggiorna($json_data) {     
        global $con;
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

        // Elimino tutte le regole ma non quelle globali
        
        $sql = "SELECT s.ID_REGOLA FROM schemi_regole s JOIN regole r ON s.ID_REGOLA=r.ID_REGOLA " .
                "WHERE s.ID_SCHEMA=$idSchema AND r.GLOBAL='N' ";
        $rules = select_column($sql);

        if ($rules) {
            $ids = implode(',', $rules);
            $sql = "DELETE FROM regole_options WHERE ID_REGOLA IN ($ids)";
            execute_update($sql);
            $sql = "DELETE FROM regole_sottoschemi WHERE ID_REGOLA IN ($ids)";
            execute_update($sql);
            $sql = "DELETE FROM regole WHERE ID_REGOLA IN ($ids)";
        }

        $sql = "DELETE FROM schemi_regole WHERE ID_SCHEMA = $idSchema";
        execute_update($sql);
        $sql = "DELETE FROM schemi_codifica WHERE ID_SCHEMA = $idSchema";
        execute_update($sql);
    }

    function uploadImmagine($idSchema, $tmpFile) {
        // fix per percorsi Windows
        $tmpFile = str_replace("\\", "/", $tmpFile);
        $sql = "UPDATE schemi_codifica SET immagine=LOAD_FILE('$tmpFile') WHERE ID_SCHEMA = $idSchema";
        execute_update($sql);
    }

    function eliminaImmagine($idSchema) {
        $sql = "UPDATE schemi_codifica SET immagine=NULL WHERE ID_SCHEMA = $idSchema";
        execute_update($sql);
    }

    function getSchemiPadre($idSchema) {
        $sql0 = "SELECT COUNT(*) AS cnt ";
        $sql= "SELECT ID_SCHEMA,TITOLO,DESCRIZIONE,TIPOLOGIA,TPL_CODICE,TPL_DESCRIZIONE,PRE_RENDER_JS,IS_VALID,NOTE_INTERNE ";
        $sql1= "FROM schemi_codifica  x WHERE x.ID_SCHEMA IN ( ".
        "SELECT ID_SCHEMA FROM schemi_regole y where y.ID_REGOLA IN ( ".
        "SELECT ID_REGOLA FROM regole_sottoschemi z WHERE z.ID_SOTTO_SCHEMA = $idSchema )) ";
        $sql1 .= "ORDER BY x.titolo";
        $count = select_single_value($sql0 . $sql1);
        $objects = select_list($sql . $sql1);        
        return [$objects, $count];
    }
}
?>