<?php
	require 'config.php';
	
	$user=$_POST['user'];
	$query = mysql_query("SELECT * FROM `user_img`  WHERE user='$user' order by id desc") or die('SQL 错误！');
	
	
	while($r = mysql_fetch_array($query)){
		echo $r['img'];//输出字段
		break;
	}
	
	mysql_close();
?>