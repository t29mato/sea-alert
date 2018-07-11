function Ohshima() {
  // 初期化
  // Logger = BetterLog.useSpreadsheet('1uMK9iRudcrsq5JP3qw2SKpmucWudry_FW0T3sbb1yi0'); 
  var dateScriptBegin    = new Date();    
  var spreadsheet        = SpreadsheetApp.openById("1uMK9iRudcrsq5JP3qw2SKpmucWudry_FW0T3sbb1yi0");
  var point              = "伊豆大島";
  var url                = "http://izuohshima-diving.com/divelog/";
  var sheet              = spreadsheet.getSheetByName(point);
  var response           = UrlFetchApp.fetch(url).getContentText();
  
  // 日時取得  
  var regexpDate         = /<h3>([\s\S]*?)<\/h3>/i;
  var tmpDate            = regexpDate.exec(response);
  var strDate            = tmpDate[1];
  
  // ポイント取得
  var regexpPoint        = /<p>ポイント：([\s\S]*?)水温/i;
  var tmpPoint           = regexpPoint.exec(response);
  var strPoint           = tmpPoint[1];
  
  // 水温取得
  var regexpWaterTemp    = /水温：([\s\S]*?)透明度/i;
  var tmpWaterTemp       = regexpWaterTemp.exec(response);
  var strWaterTemp       = tmpWaterTemp[1];
  
  // 透明度取得
  var regexpWaterClarity = /透明度：([\s\S]*?)<\/p>/i;
  var tmpWaterClarity    = regexpWaterClarity.exec(response);
  var strWaterClarity    = tmpWaterClarity[1];
  
  // 取得に要した時間計測
  var dateScriptEnd      = new Date();
  var strScriptTime      = ((dateScriptEnd - dateScriptBegin) / 1000 + "s");
  
  // 配列にまとめる
  var statuses = [
    [      
      strDate,
      strPoint,
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
    var strMessage = "海況情報が更新されました。\n・日付：" + recentStatuses[0][0] + " → " + statuses[0][0] + "\n・ポイント：" + recentStatuses[0][1] + " → " + statuses[0][1] + "\n・水温：" + recentStatuses[0][2] + " → " + statuses[0][2] + "\n・透明度：" + recentStatuses[0][3] + " → " + statuses[0][3] + "\n詳細はこちら：" + url;
    postMessage(point, strMessage, 'https://hooks.slack.com/services/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')
  }
  
  // シートに出力
  sheet.getRange(lastRow + 1, 1, 1, statuses[0].length).setValues(statuses);
}