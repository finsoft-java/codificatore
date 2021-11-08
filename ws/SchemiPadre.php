<?php

include("include/all.php");
$con = connect();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    //do nothing, HTTP 200
    exit();
}

require_logged_user_JWT();

$idSchema = isset($_GET['idSchema']) ? $con->escape_string($_GET['idSchema']) : null;

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    [$list, $count] = $schemiManager->getSchemiPadre($idSchema);
        
    header('Content-Type: application/json');
    echo json_encode(['data' => $list, 'count' => $count]);
} else {
    //==========================================================
    print_error(400, "Unsupported method in request: " . $_SERVER['REQUEST_METHOD']);
}

?>