<?php
	require 'config.php';
	
	$user=$_POST['user'];
	$query = mysql_query("SELECT `title`,  `date` FROM `question` WHERE user='$user' order by id desc") or die('SQL 错误！');
	
	$json = '';
	
	while (!!$row = mysql_fetch_assoc($query)) {
		foreach ( $row as $key => $value ) {
			$row[$key] = urlencode(str_replace("\n","", $value));
		}
		$json .= urldecode(json_encode($row)).',';
	}
	
	echo '['.substr($json, 0, strlen($json) - 1).']';
	
	
	mysql_close();
?>