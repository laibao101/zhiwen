<?php
	/*
	 标题，描述(可选)
	 首页上出现 标题和回答中最热门的部分
	 评论
	*/
	
	/*
		标题，描述+ 评论 （用评论代替回答）
	*/
	
	sleep(1);
	require 'config.php';
	
	$query = "INSERT INTO question (title, content, user, date,content_id) VALUES ('{$_POST['title']}', '{$_POST['content']}', '{$_POST['user']}', NOW(),'{$_POST['content_id']}')";
	echo $_POST['content_id'];
	
	mysql_query($query) or die('新增失败！'.mysql_error());
	
	echo mysql_affected_rows();
	
	mysql_close();
?>