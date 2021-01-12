<?php

$d = isset($_GET["d"]) ? $_GET["d"] : "";
$desk = isset($_GET["desk"]) ? $_GET["desk"] : "";

$desks = array(1,2,3,4,5,6);
if(!in_array($desk,$desks)){
    die();
}

if($d == "done"){
    $fh = fopen("tracks/vrot_data_rtTrack_desk".$desk.".txt.done","w");
    fwrite($fh,"done");
    fclose($fh);
}
else{
    $e = explode(",",trim($d));
    if($e[1] == "latitude"){
       $m = "w";
    }
    else{
        $m = "a";
    }
    $fh = fopen("tracks/vrot_data_rtTrack_desk".$desk.".txt",$m);
    fwrite($fh,trim($d)."\n");
    fclose($fh);
}

?>
