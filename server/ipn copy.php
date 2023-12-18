<?php
$raw_post_data = file_get_contents('php://input');
$raw_post_array = explode('&', $raw_post_data);
$myPost = array();
foreach ($raw_post_array as $keyval) {
  $keyval = explode ('=', $keyval);
  if (count($keyval) == 2)
    $myPost[$keyval[0]] = urldecode($keyval[1]);
}
$req = 'cmd=_notify-validate';
if (function_exists('get_magic_quotes_gpc')) {
  $get_magic_quotes_exists = true;
}
foreach ($myPost as $key => $value) {
  if ($get_magic_quotes_exists == true && get_magic_quotes_gpc() == 1) {
    $value = urlencode(stripslashes($value));
  } else {
    $value = urlencode($value);
  }
  $req .= "&$key=$value";
}
$ch = curl_init('https://ipnpb.paypal.com/cgi-bin/webscr');
curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $req);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 1);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
curl_setopt($ch, CURLOPT_FORBID_REUSE, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Connection: Close'));
if ( !($res = curl_exec($ch)) ) {
  curl_close($ch);
  exit;
}
curl_close($ch);

if (strcmp ($res, "VERIFIED") == 0) {
  if (!empty($myPost)) {
    file_put_contents('ipn_log.txt', print_r($myPost, true));
} else {
    file_put_contents('ipn_log.txt', 'The $myPost array is empty.');
}

  } else if (strcmp ($res, "INVALID") == 0) {
    // IPN invalid, log for manual investigation
    // TODO: Implement your custom logic here
  
    // Log IPN message to a file
    if (!empty($myPost)) {
      file_put_contents('ipn_log.txt', print_r($myPost, true));
  } else {
      file_put_contents('ipn_log.txt', 'res is INVALID');
  }
  
  }
 