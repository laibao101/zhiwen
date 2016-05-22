<?php
	sleep(1);
	require 'config.php';
	
	$query = "INSERT INTO user_img (user, img) 
	VALUES ('{$_POST['user']}', '{$_POST['url']}')";
	
	mysql_query($query) or die('新增失败！'.mysql_error());
	
	echo mysql_affected_rows();
	
	mysql_close();
?>