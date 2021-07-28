<?php

$regoleManager = new RegoleManager();

class RegoleManager {
    
    function getAllByIdSchema($idSchema) {
        $sql0 = "SELECT COUNT(*) AS cnt ";
        $sql1 = "SELECT s.*,r.GLOBAL,r.ETICHETTA,r.REQUIRED,r.TIPO,r.MAXLENGTH,r.PATTERN_REGEXP,r.NUM_DECIMALI,r.MIN,r.MAX ";
        $sql = "FROM schemi_regole s JOIN REGOLE r ON r.ID_REGOLA=s.ID_REGOLA WHERE ID_SCHEMA=$idSchema " .
               "ORDER BY s.ORD_PRESENTAZIONE ";
        $count = select_single_value($sql0 . $sql);
        $objects = select_list($sql1 . $sql);

        // FIXME: subroutine completamento
        foreach($objects as $id=>$o) {
            $sql = "SELECT * FROM regole_options " .
                "WHERE ID_REGOLA=$o[ID_REGOLA] " .
                "ORDER BY VALUE_OPTION";
            $objects[$id]["OPTIONS"] = select_list($sql);

            $sql = "SELECT rs.*, s.TITOLO FROM regole_sottoschemi rs " .
                "JOIN schemi_codifica s ON s.ID_SCHEMA=rs.ID_SOTTO_SCHEMA " .
                "WHERE rs.ID_REGOLA=$o[ID_REGOLA] " .
                "ORDER BY s.TITOLO";
            $objects[$id]["SOTTOSCHEMI"] = select_list($sql);
        }
        return [$objects, $count];
    }

    function getAllGlobali() {
        $sql0 = "SELECT COUNT(*) AS cnt ";
        $sql1 = "SELECT NULL AS IS_SCHEMA, NULL AS ORD_PREENTAZIONE, r.* ";
        $sql = "FROM REGOLE r WHERE GLOBAL='Y'' " .
               "ORDER BY r.NOM_VARIABILE ";
        $count = select_single_value($sql0 . $sql);
        $objects = select_list($sql1 . $sql);

        // FIXME: subroutine completamento
        foreach($objects as $id=>$o) {
            $sql = "SELECT * FROM regole_options " .
                "WHERE ID_REGOLA=$o[ID_REGOLA] " .
                "ORDER BY VALUE_OPTION";
            $objects[$id]["OPTIONS"] = select_list($sql);

            $sql = "SELECT rs.*, s.TITOLO FROM regole_sottoschemi rs " .
                "JOIN schemi_codifica s ON s.ID_SCHEMA=rs.ID_SOTTO_SCHEMA " .
                "WHERE rs.ID_REGOLA=$o[ID_REGOLA] " .
                "ORDER BY s.TITOLO";
            $objects[$id]["SOTTOSCHEMI"] = select_list($sql);
        }
        return [$objects, $count];
    }
    
    function getById($id_schema, $nomVariabile) {
        $sql = "SELECT s.*,r.GLOBAL,r.ETICHETTA,r.REQUIRED,r.TIPO,r.MAXLENGTH,r.PATTERN_REGEXP,r.NUM_DECIMALI,r.MIN,r.MAX " .
                "FROM schemi_regole s JOIN REGOLE r ON r.ID_REGOLA=s.ID_REGOLA " .
                "WHERE s.ID_SCHEMA=$idSchema AND s.NOM_VARIABILE='$nomVariabile' " .
                "ORDER BY s.ORD_PRESENTAZIONE ";
        $o = select_single($sql);

        // FIXME: subroutine completamento
        $sql = "SELECT * FROM regole_options " .
            "WHERE ID_SCHEMA=$id_schema and NOM_VARIABILE='$nomVariabile' " .
            "ORDER BY VALUE_OPTION";
        $o["OPTIONS"] = select_list($sql);

        $sql = "SELECT s.*, b.TITOLO FROM regole_sottoschemi s " .
            "JOIN schemi_codifica b ON b.ID_SCHEMA=s.ID_SOTTO_SCHEMA " .
            "WHERE s.ID_SCHEMA=$id_schema AND s.NOM_VARIABILE='$nomVariabile' " .
            "ORDER BY b.TITOLO";
        $o["SOTTOSCHEMI"] = select_list($sql);

        return $o;
    }

    function crea($json_data) {
        global $con;
        $sql = insert("regole", ["NOM_VARIABILE" => $con->escape_string($json_data->NOM_VARIABILE),
                                "GLOBAL" => $con->escape_string($json_data->GLOBAL),
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
        $idRegola = $con->insert_id;
        $sql = insert("schemi_regole", ["ID_SCHEMA" => $con->escape_string($json_data->ID_SCHEMA),
                                "NOM_VARIABILE" => $con->escape_string($json_data->NOM_VARIABILE),
                                "ORD_PRESENTAZIONE" => $con->escape_string($json_data->ORD_PRESENTAZIONE),
                                "ID_REGOLA" => $idRegola
                                ]);
        execute_update($sql);
        return $this->getById($json_data->ID_SCHEMA, $json_data->NOM_VARIABILE);
    }
    
    function aggiorna($json_data) {     
        global $con;
        // sulla tabella schemi_regole posso aggiornare solamente l'ordinamento
        $sql = update("schemi_regole", ["ORD_PRESENTAZIONE" => $con->escape_string($json_data->ORD_PRESENTAZIONE)], 
                                ["ID_SCHEMA" => $con->escape_string($json_data->ID_SCHEMA),
                                "NOM_VARIABILE" => $con->escape_string($json_data->NOM_VARIABILE)]);
        execute_update($sql);

        // sulla tabella regole *non * posso aggiornare GLOBAL, nè NOM_VARIABILE
        $sql = update("regole", ["ETICHETTA" => $con->escape_string($json_data->ETICHETTA),
                                "REQUIRED" => $con->escape_string($json_data->REQUIRED),
                                "TIPO" => $con->escape_string($json_data->TIPO),
                                "MAXLENGTH" => $con->escape_string($json_data->MAXLENGTH),
                                "PATTERN_REGEXP" => $con->escape_string($json_data->PATTERN_REGEXP),
                                "NUM_DECIMALI" => $con->escape_string($json_data->NUM_DECIMALI),
                                "MIN" => $con->escape_string($json_data->MIN),
                                "MAX" => $con->escape_string($json_data->MAX)], 
                               ["ID_REGOLA" => $con->escape_string($json_data->ID_REGOLA)]);
        execute_update($sql);

        $sql = "DELETE FROM regole_options WHERE ID_REGOLA = $json_data->ID_REGOLA ";
        execute_update($sql);

        $giaInseriti = [];  // evito di inserire duplicati
        if (isset($json_data->OPTIONS)) {
            foreach ($json_data->OPTIONS as $o) {
                if (!in_array($o->VALUE_OPTION, $giaInseriti)) {
                    $sql = insert("regole_options", ["ID_REGOLA" => $con->escape_string($o->ID_REGOLA),
                        "VALUE_OPTION" => $con->escape_string($o->VALUE_OPTION),
                        "ETICHETTA" => $con->escape_string($o->ETICHETTA)
                        ]);
                    execute_update($sql);
                    $giaInseriti[] = $o->VALUE_OPTION;
                }
            }
        }

        $sql = "DELETE FROM regole_sottoschemi WHERE ID_REGOLA = $json_data->ID_REGOLA ";
        execute_update($sql);

        $giaInseriti = [];  // evito di inserire duplicati
        if (isset($json_data->SOTTOSCHEMI)) {
            foreach ($json_data->SOTTOSCHEMI as $o) {
                if (!in_array($o->ID_SOTTO_SCHEMA, $giaInseriti)) {
                    $sql = insert("regole_sottoschemi", ["ID_REGOLA" => $con->escape_string($o->ID_REGOLA),
                        "ID_SOTTO_SCHEMA" => $con->escape_string($o->ID_SOTTO_SCHEMA)
                        ]);
                    execute_update($sql);
                    $giaInseriti[] = $o->ID_SOTTO_SCHEMA;
                }
            }
        }
    }

    function elimina($idSchema, $nomVariabile) {
        // Elimino tutto, tranne le variabili globali
        $sql = "SELECT s.ID_REGOLA FROM schemi_regole s JOIN regole r ON s.ID_REGOLA=r.ID_REGOLA " .
                "WHERE s.ID_SCHEMA=$idSchema AND s.NOM_VARIABILE='$nomVariabile' AND r.GLOBAL='N' ";
        $ids = implode(',', select_column($sql));

        $sql = "DELETE FROM regole_options WHERE ID_REGOLA IN ($ids)";
        execute_update($sql);
        $sql = "DELETE FROM regole_sottoschemi WHERE ID_REGOLA IN ($ids) ";
        execute_update($sql);
        $sql = "DELETE FROM regole WHERE ID_REGOLA IN ($ids) ";
        execute_update($sql);
        $sql = "DELETE FROM schemi_regole WHERE ID_SCHEMA = $idSchema AND NOM_VARIABILE='$nomVariabile' ";
        execute_update($sql);
    }
}
?>