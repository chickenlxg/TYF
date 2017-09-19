<?php
header("Content-type:text/html; charset=utf-8");
function getToken($url){
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL,$url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER,1); //相当关键，这句话是让curl_exec($ch)返回的结果可以进行赋值给其他的变量进行，json的数据操作，如果没有这句话，则curl返回的数据不可以进行人为的去操作（如json_decode等格式操作）
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
	return curl_exec($ch);
	//$row=curl_getinfo($ch, CURLINFO_HTTP_CODE);
}

$appid = 'wxdf070b701e2e25fa';
$secret = '22f65b3955601d980533fe3a95d4da6a';
$code = $_GET['code'];
$url = 'https://api.weixin.qq.com/sns/jscode2session?appid='.$appid.'&secret='.$secret.'&js_code='.$code.'&grant_type=authorization_code';



$row=getToken($url);
$obj=json_decode($row);
echo $obj->openid;
?> 