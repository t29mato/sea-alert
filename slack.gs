function postMessage(point, message, hookPoint) {
  var payload = {
    "text": message,
    "icon_emoji": ':dolphin:',
    "username": '海況速報 [' + point + ']'
  }
  var options = {
    "method" : "POST",
    "payload" : JSON.stringify(payload),
    "headers": {
      "Content-type": "application/json",
    }
  }
  var response = UrlFetchApp.fetch(hookPoint, options);

  if (response.getResponseCode() == 200) {
    return response;
  }
  return false;
}