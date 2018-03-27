<?php
require_once('../classes/class_restapi.php');
require_once('../classes/class_auth.php');
require_once('../classes/class_page.php');
$api = new Restapi();
$auth = new Auth();
$page = new Page();

$command = $api->getCommand();
$L = $page->L;

//User register
if($api->getCommand() == 'signup'){
	$name = $api->getParam('name');
	$email = $api->getParam('email');
	$password = $api->getParam('password');
	$password2 = $api->getParam('password2');

	if(empty($name)) 								    $api->clientError($L['login:signup:msg:empty_name'],'name');
	if(empty($email)) 								    $api->clientError($L['login:signup:msg:empty_email'],'email');
	if(empty($password)) 							    $api->clientError($L['login:signup:msg:empty_password'],'password');
	if(empty($password2)) 							    $api->clientError($L['login:signup:msg:empty_password2'],'password2');

	if(mb_strlen($name,"UTF-8") < 2) 					$api->clientError($L['login:signup:msg:name_too_short'],'name');
	if(!filter_var($email, FILTER_VALIDATE_EMAIL))		$api->clientError($L['login:signup:msg:email_fail'],'email');

	if($password != $password2)							$api->clientError($L['login:signup:msg:password_mismatch'],'password2');

	if($auth->IsEmail($email))							$api->serverError($L['login:signup:msg:email_exists'],'email');

	if(!$uid = $auth->Register($email,$password,$name))	$api->serverError($L['system_error']);
	$auth->AddPriv($uid,'contributor');
	$api->makeJSON('success');
}

// Авторизация пользователя
if($api->getCommand() == 'login'){
	$user = $api->getParam('user');
	$password = $api->getParam('password');
	$remember = ($api->getParam('remember') == 1) ? true : false;

	if(empty($user)) 								    $api->clientError('Не указан пользователь','user');
    if(empty($password)) 							    $api->clientError('Указан пустой пароль', 'password');
    
    if(!$auth->IsUser($user))                          $api->clientError('Такого пользователя не существует','user');
	if(!$auth->Login($user,$password,$remember)) 	    $api->serverError('Указан неверный пароль', 'password');

	$api->makeJSON('success');
}

$api->clientError('Неизвестная команда');
?>