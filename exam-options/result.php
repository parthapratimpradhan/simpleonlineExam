<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // collect value of input field
    $name = $_POST['name']; 
	$result = $_POST['result']; 
	$time = $_POST['time'];
	$setName = $_POST['setName'];
	$myfile = fopen("result-db/result.txt", "a") or die("Unable to open file!");
	fwrite($myfile, "$name $result time : $time setName: $setName\n");
	fclose($myfile);
	echo true; 
}
?>