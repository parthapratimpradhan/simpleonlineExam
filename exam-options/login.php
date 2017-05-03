<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // collect value of input field
    $string = file_get_contents("user-db/userinfo.json");
	$json = json_decode($string, true);

    $username = $_POST["username"]; 
	$password = $_POST["password"]; 
	$arrlength = count($json);
	for ($x = 0; $x < $arrlength; $x++) {
		if($json[$x]["username"] == $username && $json[$x]["password"] == $password){
			echo "login successful";
			setcookie("username", $username, time() + (86400 * 30), "/");
			setcookie("authenticated", "true", time() + (86400 * 30), "/");
			header("Location: set.html");
			exit();
			break; 
		}
	    
	    //echo $arrlength;
	} 
	setcookie("authenticated", "false", time() + (86400 * 30), "/");
	setcookie("username", $username, time() + (86400 * 30), "/");
	echo "login unsucceful";
	//echo "$username $password";
}
?>