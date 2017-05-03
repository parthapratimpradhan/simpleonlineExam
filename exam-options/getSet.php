<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // collect value of input field
    $authenticated = $_POST['authenticated'];
    $setName =  $_POST['setname'];
    $url="questions-db/".$setName;
	//$result = $_POST['result']; 
	//$time = $_POST['time'];
	//echo $authenticated;
	if($authenticated == "true"){
		//echo $authenticated;
		//echo "true";
		$myfile = file_get_contents($url);
		//$json = json_encode($myfile, true);
		header('Content-type: application/json');
		//fwrite($myfile, "$name $result $time\n");
		//fclose($myfile);
		echo $myfile;
	}else{
		echo "false" ;
		//header("Location: index.html");
		//echo false ;
	}
	 
}
?>