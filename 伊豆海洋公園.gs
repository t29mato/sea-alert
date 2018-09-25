function IOP() {
  // 初期化 (共通)
  var dateScriptBegin    = new Date();
  var spreadsheetId      = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  Logger = BetterLog.useSpreadsheet(spreadsheetId); 
  var spreadsheet        = SpreadsheetApp.openById(spreadsheetId);

  // 初期化 (個別)
  var point              = "伊豆海洋公園";
  var url                = "http://iop-dc.com";
  var sheet              = spreadsheet.getSheetByName(point);
  var response           = UrlFetchApp.fetch(url);

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

  // 直近のシートの値と比較してログ出力に加えて、更新が確認できた場合はSlackへ投稿する。
  if (statuses[0][0] == recentStatuses[0][0] && statuses[0][1] == recentStatuses[0][1] && statuses[0][2] == recentStatuses[0][2] && statuses[0][3] == recentStatuses[0][3]) {
    var strLog = "[" + point + "] 重複のためシートへの出力はしない";
    Logger.log(strLog);
    return;
  } else {
    var strLog = "[" + point + "] 直近の情報と異なるので右記をシートに出力" + statuses;
    Logger.log(strLog);
    var strMessage = "海況情報が更新されました。\n・日付：" + recentStatuses[0][0] + " → " + statuses[0][0] + "\n・サービス：" + recentStatuses[0][1] + " → " + statuses[0][1] + "\n・水温：" + recentStatuses[0][2] + " → " + statuses[0][2] + "\n・透明度：" + recentStatuses[0][3] + " → " + statuses[0][3] + "\n詳細はこちら：" + url;
    postMessage(point, strMessage);
  }

  // シートに出力
  sheet.getRange(lastRow + 1, 1, 1, statuses[0].length).setValues(statuses);  
}