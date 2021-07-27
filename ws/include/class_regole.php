<?php

$regoleManager = new RegoleManager();

class RegoleManager {
    
    function getAll($idSchema = null) {
        $sql0 = "SELECT COUNT(*) AS cnt ";
        $sql1 = "SELECT * ";
        $sql = "FROM schemi_regole x ";
        if ($idSchema != null) {
            $sql .= "WHERE ID_SCHEMA=$idSchema ";
        }
        $sql .= "ORDER BY x.ID_SCHEMA, x.ORD_PRESENTAZIONE ";
        $count = select_single_value($sql0 . $sql);
        $objects = select_list($sql1 . $sql);

        foreach($objects as $id=>$o) {
            $sql = "SELECT * FROM schemi_options " .
                "WHERE ID_SCHEMA=$o[ID_SCHEMA] and NOM_VARIABILE='$o[NOM_VARIABILE]' " .
                "ORDER BY VALUE_OPTION";
            $objects[$id]["OPTIONS"] = select_list($sql);

            $sql = "SELECT b.ID_SCHEMA, b.TITOLO FROM schemi_sottoschemi s " .
                "JOIN schemi_codifica b ON b.ID_SCHEMA=s.ID_SOTTO_SCHEMA " .
                "WHERE s.ID_SCHEMA=$o[ID_SCHEMA] AND s.NOM_VARIABILE='$o[NOM_VARIABILE]'  ORDER BY 1";
            $objects[$id]["SOTTOSCHEMI"] = select_list($sql);
        }
        return [$objects, $count];
    }
    
    function getById($id_schema, $nomVariabile) {
        $sql = "SELECT * FROM schemi_regole x WHERE x.id_schema=$id_schema AND x.nom_variabile='$nomVariabile' ";
        $o = select_single($sql);

        $sql = "SELECT * FROM schemi_options " .
            "WHERE ID_SCHEMA=$id_schema and NOM_VARIABILE='$nomVariabile' " .
            "ORDER BY VALUE_OPTION";
        $o["OPTIONS"] = select_list($sql);

        $sql = "SELECT b.ID_SCHEMA, b.TITOLO FROM schemi_sottoschemi s " .
            "JOIN schemi_codifica b ON b.ID_SCHEMA=s.ID_SOTTO_SCHEMA " .
            "WHERE s.ID_SCHEMA=$id_schema AND s.NOM_VARIABILE='$nomVariabile'  ORDER BY 1";
        $o["SOTTOSCHEMI"] = select_list($sql);

        return $o;
    }

    function crea($json_data) {
        global $con;
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
        return $this->getById($json_data->ID_SCHEMA, $json_data->NOM_VARIABILE);
    }
    
    function aggiorna($json_data) {     
        global $con;
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

        $sql = "DELETE FROM schemi_options WHERE ID_SCHEMA = $json_data->ID_SCHEMA AND NOM_VARIABILE='$json_data->NOM_VARIABILE' ";
        execute_update($sql);

        if (isset($json_data->OPTIONS)) {
            foreach ($json_data->OPTIONS as $o) {
                $sql = insert("schemi_options", ["ID_SCHEMA" => $con->escape_string($o->ID_SCHEMA),
                    "NOM_VARIABILE" => $con->escape_string($o->NOM_VARIABILE),
                    "VALUE_OPTION" => $con->escape_string($o->VALUE_OPTION),
                    "ETICHETTA" => $con->escape_string($o->ETICHETTA)
                    ]);
                execute_update($sql);
            }
        }

        $sql = "DELETE FROM schemi_sottoschemi WHERE ID_SCHEMA = $json_data->ID_SCHEMA AND NOM_VARIABILE='$json_data->NOM_VARIABILE' ";
        execute_update($sql);

        if (isset($json_data->SOTTOSCHEMI)) {
            foreach ($json_data->SOTTOSCHEMI as $o) {
                $sql = insert("schemi_sottoschemi", ["ID_SCHEMA" => $con->escape_string($o->ID_SCHEMA),
                    "NOM_VARIABILE" => $con->escape_string($o->NOM_VARIABILE),
                    "ID_SOTTO_SCHEMA" => $con->escape_string($o->ID_SOTTO_SCHEMA)
                    ]);
                execute_update($sql);
            }
        }
    }

    function elimina($idSchema, $nomVariabile) {
        $sql = "DELETE FROM schemi_regole WHERE ID_SCHEMA = $idSchema AND NOM_VARIABILE='$nomVariabile' ";
        execute_update($sql);
    }
}
?>