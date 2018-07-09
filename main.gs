function myFunction() {
  // 初期化
  var dateScriptBegin    = new Date();    
  var spreadsheet        = SpreadsheetApp.openById("1uMK9iRudcrsq5JP3qw2SKpmucWudry_FW0T3sbb1yi0");
  var sheet              = spreadsheet.getSheetByName("IOP");
  var response           = UrlFetchApp.fetch("http://iop-dc.com");

  // 日時と海況情報取得  
  var regexpDateStatus   = /<dt>([\s\S]*?)の海況<\/dt>([\s\S]*?)<dd>([\s\S]*?)<\/dd>/i;
  var tmpDateStatus      = regexpDateStatus.exec(response.getContentText());
  var strDate            = tmpDateStatus[1];
  var strStatus          = tmpDateStatus[3];
  
  // 水温取得
  var regexpWaterTemp    = /<h4>水温<\/h4>([\s\S]*?)<dd>([\s\S]*?)<\/dd>/i;
  var tmpWaterTemp       = regexpWaterTemp.exec(response.getContentText());
  var strWaterTemp       = tmpWaterTemp[2];
  
  // 透明度取得
  var regexpWaterClarity = /<h4>透視度<\/h4>([\s\S]*?)<dd>([\s\S]*?)<\/dd>/i;
  var tmpWaterClarity    = regexpWaterClarity.exec(response.getContentText());
  var strWaterClarity    = tmpWaterClarity[2];
  
  // 取得した値をログ出力
  Logger.log(strDate);
  Logger.log(strStatus);
  Logger.log(strWaterTemp);
  Logger.log(strWaterClarity);

  // 取得に要した時間計測
  var dateScriptEnd      = new Date();
  var strScriptTime      = ((dateScriptEnd - dateScriptBegin) / 1000 + "s");
  
  // 配列にまとめる
  var statuses = [
    strDate,
    strStatus,
    strWaterTemp,
    strWaterClarity,
    dateScriptBegin,
    strScriptTime
  ];

  // シートに挿入
  // todo: APIをループではなくてまとめて実施
  var lastRow = sheet.getLastRow();
  for (var i = 0; i < statuses.length; i += 1) {
    sheet.getRange(lastRow + 1, i + 1).setValue(statuses[i]);
  }
}