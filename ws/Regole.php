<?php

include("include/all.php");
$con = connect();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    //do nothing, HTTP 200
    exit();
}

require_logged_user_JWT();

$idSchema = isset($_GET['idSchema']) ? $con->escape_string($_GET['idSchema']) : null;
$nomVariabile = isset($_GET['nomVariabile']) ? $con->escape_string($_GET['nomVariabile']) : null;
$soloGlobali = isset($_GET['soloGlobali']) ? $con->escape_string($_GET['soloGlobali']) == 'true' : false;

//------
$idRegola = isset($_GET['idRegola']) ? $con->escape_string($_GET['idRegola']) : null;
//-----

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    
    if ($idSchema  !== null && $nomVariabile) {
        $object = $regoleManager->getById($idSchema, $nomVariabile);
        header('Content-Type: application/json');
        echo json_encode(['value' => $object]);
    
    } else if ($idSchema !== null) {
        // $idSchema may be null or not
        [$list, $count] = $regoleManager->getAllByIdSchema($idSchema, $soloGlobali);
          
        header('Content-Type: application/json');
        echo json_encode(['data' => $list, 'count' => $count]);
    } else if ($soloGlobali) {
        // $idSchema may be null or not
        [$list, $count] = $regoleManager->getAllGlobali();
          
        header('Content-Type: application/json');
        echo json_encode(['data' => $list, 'count' => $count]);
    } else {
        print_error(400, 'Un parametro tra idSchema e soloGlobali deve essere settato');
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    //==========================================================
    $postdata = file_get_contents("php://input");
    $json_data = json_decode($postdata);
    if (!$json_data) {
        print_error(400, "Missing JSON data");
    }
    $object = $regoleManager->crea($json_data);
    
    header('Content-Type: application/json');
    echo json_encode(['value' => $object]);
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    //==========================================================
    $postdata = file_get_contents("php://input");
    $json_data = json_decode($postdata);
    if (!$json_data) {
        print_error(400, "Missing JSON data");
    }
    if (property_exists($json_data, 'ID_SCHEMA')) {
        $object = $regoleManager->getById($json_data->ID_SCHEMA, $json_data->NOM_VARIABILE);
    }
    else {
        $object = $regoleManager->getRegolaGlobale($json_data->ID_REGOLA);
    }
    if (!$object) {
        print_error(404, 'Not found');
    }
    $regoleManager->aggiorna($json_data);
    
    if (property_exists($json_data, 'ID_SCHEMA')) {
        $object = $regoleManager->getById($json_data->ID_SCHEMA, $json_data->NOM_VARIABILE);
    }
    else {
        $object = $regoleManager->getRegolaGlobale($json_data->ID_REGOLA);
    }    header('Content-Type: application/json');
    echo json_encode(['value' => $object]);
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    //==========================================================
    if(!$idRegola){
        if (!$idSchema) {
            print_error(400, 'Missing idSchema');
        }
        if (!$nomVariabile) {
            print_error(400, 'Missing nomVariabile');
        }
        $object = $regoleManager->getById($idSchema, $nomVariabile);
        if (!$object) {
            print_error(404, 'Not found');
        }
        
        $regoleManager->elimina($idSchema, $nomVariabile);
    }
    else {
        $regoleManager->eliminaGenerale($idRegola);
    }
    
} else {
    //==========================================================
    print_error(400, "Unsupported method in request: " . $_SERVER['REQUEST_METHOD']);
}


?>