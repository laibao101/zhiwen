<?php
header('Content-type:text/html; charset="utf-8"');
$upload_dir = 'uploads/content/';

if(strtolower($_SERVER['REQUEST_METHOD']) != 'post'){
	exit_status(array('code'=>1,'msg'=>'错误提交方式'));
}

if(array_key_exists('file',$_FILES) && $_FILES['file']['error'] == 0 ){
	
	$date=date('Ymdhis');//得到当前时间,如;20070705163148
	$fileName=$_FILES['file']['name'];//得到上传文件的名字
	$name=explode('.',$fileName);//将文件名以'.'分割得到后缀名,得到一个数组
	$newPath=$date.'.'.$name[1];//得到一个新的文件为'20070705163148.jpg',即新的路径
	$oldPath=$_FILES['file']['tmp_name'];//临时文件夹,即以前的路径
	if(move_uploaded_file($_FILES['file']['tmp_name'], $upload_dir.$newPath)){
		exit_status(array('code'=>0,'msg'=>'上传成功','url'=>$upload_dir.$newPath));
	}
	
	
}
echo $_FILES['file']['error'];
exit_status(array('code'=>1,'msg'=>'出现了一些错误'));

function exit_status($str){
	echo json_encode($str);
	exit;
}
?>