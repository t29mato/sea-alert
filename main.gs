function myFunction() {
  var response = UrlFetchApp.fetch("http://iop-dc.com");

  var regexpDateStatus  = /<dt>([\s\S]*?)の海況<\/dt>([\s\S]*?)<dd>([\s\S]*?)<\/dd>/i;
  var tmpDateStatus     = regexpDateStatus.exec(response.getContentText());
  var strDate           = tmpDateStatus[1];
  var strStatus         = tmpDateStatus[3];

  var regexpWaterTemp   = /<h4>水温<\/h4>([\s\S]*?)<dd>([\s\S]*?)<\dd>;
  var tmpWatertemp      = regexpWaterTemp.exec(response.getContentText());
  var strWaterTemp      = tmpWatertemp[2];

  Logger.log(strDate);
  Logger.log(strStatus);
  Logger.log(strWaterTemp);
}