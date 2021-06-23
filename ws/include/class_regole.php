<?php

$regoleManager = new RegoleManager();

class RegoleManager {
    
    function getAll() {
        $sql0 = "SELECT COUNT(*) AS cnt ";
        $sql1 = "SELECT * ";
        $sql = "FROM schemi_regole x ";

        $sql .= " ORDER BY x.ID_SCHEMA DESC";
        $count = select_single_value($sql0 . $sql);
        $aree = select_list($sql1 . $sql);        
        return [$aree, $count];
    }
    
    function getById($id_schema, $nomVariabile) {
        $sql = "SELECT * FROM schemi_regole x WHERE x.id_schema=$id_schema AND x.nom_variabile='$nomVariabile' ";
        return select_single($sql);
    }

    function crea($json_data) {

        $sql = insert("schemi_regole", ["ID_SCHEMA" => $con->escape_string($json_data->ID_SCHEMA),
                                "NOM_VARIABILE" => $con->escape_string($json_data->NOM_VARIABILE),
                                "ORD_PRESENTAZIONE" => $con->escape_string($json_data->ORD_PRESENTAZIONE),
                                "ETICHETTA" => $con->escape_string($json_data->ETICHETTA),
                                "REQUIRED" => $con->escape_string($json_data->REQUIRED),
                                "TIPO" => $con->escape_string($json_data->TIPO),
                                "MAXLENGTH" => $con->escape_string($json_data->MAXLENGTH),
                                "PATTERN_REGEXP" => $con->escape_string($json_data->PATTERN_REGEXP),
                                "NUM_DECIMALI" => $con->escape_string($json_data->NUM_DECIMALI),
                                "MIN" => $con->escape_string($json_data->MIN),
                                "MAX" => $con->escape_string($json_data->MAX)
                                ]);
        execute_update($sql);
        return $this->getById($json_data->ID_SCHEMA);
    }
    
    function aggiorna($json_data) {     
        
        $sql = update("schemi_regole", ["ORD_PRESENTAZIONE" => $con->escape_string($json_data->ORD_PRESENTAZIONE),
                                "ETICHETTA" => $con->escape_string($json_data->ETICHETTA),
                                "REQUIRED" => $con->escape_string($json_data->REQUIRED),
                                "TIPO" => $con->escape_string($json_data->TIPO),
                                "MAXLENGTH" => $con->escape_string($json_data->MAXLENGTH),
                                "PATTERN_REGEXP" => $con->escape_string($json_data->PATTERN_REGEXP),
                                "NUM_DECIMALI" => $con->escape_string($json_data->NUM_DECIMALI),
                                "MIN" => $con->escape_string($json_data->MIN),
                                "MAX" => $con->escape_string($json_data->MAX)], 
                               ["ID_SCHEMA" => $con->escape_string($json_data->ID_SCHEMA),
                                "NOM_VARIABILE" => $con->escape_string($json_data->NOM_VARIABILE)]);
        execute_update($sql);
    }

    function elimina($idSchema, $nomVariabile) {
        $sql = "DELETE FROM schemi_regole WHERE ID_SCHEMA = $idSchema AND x.nom_variabile='$nomVariabile' ";
        execute_update($sql);
    }
}
?>