<?php
$obj->body           = 'another post';  
$obj->id             = 21;  
$obj->approved       = true;  
$obj->favorite_count = 1;  
$obj->status         = NULL;  
echo json_encode($obj);  

?>