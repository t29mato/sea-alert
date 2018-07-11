function IOP() {
  // 初期化
  Logger = BetterLog.useSpreadsheet('1uMK9iRudcrsq5JP3qw2SKpmucWudry_FW0T3sbb1yi0'); 
  var dateScriptBegin    = new Date();
  var spreadsheet        = SpreadsheetApp.openById("1uMK9iRudcrsq5JP3qw2SKpmucWudry_FW0T3sbb1yi0");
  var point              = "伊豆海洋公園";
  var sheet              = spreadsheet.getSheetByName(point);
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

  // 取得に要した時間計測
  var dateScriptEnd      = new Date();
  var strScriptTime      = ((dateScriptEnd - dateScriptBegin) / 1000 + "s");
  
  // 配列にまとめる
  var statuses = [
    [
    strDate,
    strStatus,
    strWaterTemp,
    strWaterClarity,
    dateScriptBegin,
    strScriptTime
    ]
  ];

  // 直近のシートの値を取得
  var lastRow = sheet.getLastRow();
  var recentRange = sheet.getRange(lastRow, 1, 1, statuses[0].length);
  var recentStatuses = recentRange.getValues();

  // 直近のシートの値と比較
  if (statuses[0][0] == recentStatuses[0][0] && statuses[0][1] == recentStatuses[0][1] && statuses[0][2] == recentStatuses[0][2] && statuses[0][3] == recentStatuses[0][3]) {
    Logger.log("[" + point + "] 重複のためシートへの出力はしない");
    return;
  } else {
    Logger.log("[" + point + "] 直近の情報と異なるので右記をシートに出力" + statuses);
  }

  // シートに出力
  sheet.getRange(lastRow + 1, 1, 1, statuses[0].length).setValues(statuses);
}