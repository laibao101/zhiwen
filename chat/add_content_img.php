<?php
	sleep(1);
	require 'config.php';
	
	$query = "INSERT INTO content_img (content_id, url) 
	VALUES ('{$_POST['content_id']}', '{$_POST['url']}')";
	
	mysql_query($query) or die('新增失败！'.mysql_error());
	
	echo mysql_affected_rows();
	
	mysql_close();
?>