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

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    
    if ($idSchema && $nomVariabile) {
        $object = $regoleManager->getById($idSchema, $nomVariabile);
        header('Content-Type: application/json');
        echo json_encode(['value' => $object]);
    
    } else {
        // $idSchema may be null or not
        [$list, $count] = $regoleManager->getAll($idSchema);
          
        header('Content-Type: application/json');
        echo json_encode(['data' => $list, 'count' => $count]);
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
    $object = $regoleManager->getById($json_data->ID_SCHEMA, $json_data->NOM_VARIABILE);
    if (!$object) {
        print_error(404, 'Not found');
    }
    $regoleManager->aggiorna($json_data);
    
    $object = $regoleManager->getById($json_data->ID_SCHEMA, $json_data->NOM_VARIABILE);
    header('Content-Type: application/json');
    echo json_encode(['value' => $object]);
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    //==========================================================
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
    
} else {
    //==========================================================
    print_error(400, "Unsupported method in request: " . $_SERVER['REQUEST_METHOD']);
}


?>