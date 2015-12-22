<?php
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

define('AUTH_SECRET', 'xoxohahhhihihxxx');
define('DB_PATH', __DIR__. '/data/users.json');

$getContent = file_get_contents(DB_PATH);
$readUsers = json_decode($getContent);

if (! $_GET['name']) {
  foreach ($readUsers as $user) {
    unset($user->password);
  }
  echo json_encode($readUsers, JSON_PRETTY_PRINT);
  die;
}

$getUser = new StdClass;
$getUser->name = $_GET['name'];
$getUser->score = $_GET['score'];
$getUser->password = $_GET['password'];

$formType = $_GET['formType'];
$reqType = $_GET['reqType'];

if ($reqType == 'update') {
  update();
}

function update() {
  global $readUsers, $getUser;
  foreach ($readUsers as $key => $dbUser) {
    if ($dbUser->name == $getUser->name) {
      $readUsers[$key]->score = $getUser->score;
    }
  }

  file_put_contents(DB_PATH, json_encode($readUsers, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
  statusHelper('success', 'score обновлен на - ' . $getUser->score, $readUsers);
  die;
}

if ($formType == 'signin') {
  signIn();
} else {
  signUp();
}



function signIn() {
  global $readUsers, $getUser;

  $getUser->password = sha1(AUTH_SECRET . $getUser->password);

  foreach ($readUsers as $readUser) {
    if ($readUser->name == $getUser->name && $readUser->password == $getUser->password) {
      unset($readUser->password);
      statusHelper("success", "Привет " . $getUser->name, $readUser);
      die;
    }
  }

  statusHelper("error", "Нет такого пользователя или пароль не верен - " . $getUser->name);
}

function signUp() {
  global $readUsers, $getUser;

  foreach ($readUsers as $readUser) {
    foreach ($getUser as $user) {
      if ($readUser->name == $user) {
        statusHelper("error", "$readUser->name - уже существует такое имя");
        die;
      }
    }
  }

  // var_dump($readUsers);

  $getUser->password = sha1(AUTH_SECRET . $getUser->password);
  $readUsers[] = $getUser;
  file_put_contents(DB_PATH, json_encode($readUsers, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

  unset($getUser->password);
  statusHelper("success", "Привет $getUser->name", $getUser);
}

// Для вывода статуса успеха или ошибки
function statusHelper($status, $message, $data) {
  echo json_encode(["status" => $status, "message" => $message, "data" => $data], JSON_UNESCAPED_UNICODE);
}



