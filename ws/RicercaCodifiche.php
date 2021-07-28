<?php

include("include/all.php");
$con = connect();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    //do nothing, HTTP 200
    exit();
}

require_logged_user_JWT();

$top = isset($_GET['top']) ? $con->escape_string($_GET['top']) : null;
$skip = isset($_GET['skip']) ? $con->escape_string($_GET['skip']) : null;
$parametri = isset($_GET['parametri']) ? $con->escape_string($_GET['parametri']) : null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $postdata = file_get_contents("php://input");
    $json_data = json_decode($postdata);
    if (!$json_data) {
        print_error(400, "Missing JSON data");
    }

    [$list, $count] = $codificaManager->getByDatiCodifica($json_data, $top, $skip);
        
    header('Content-Type: application/json');
    echo json_encode(['data' => $list, 'count' => $count]);
    
} else {
    //==========================================================
    print_error(400, "Unsupported method in request: " . $_SERVER['REQUEST_METHOD']);
}


?>