function Futo() {
  // 初期化
  Logger = BetterLog.useSpreadsheet('1uMK9iRudcrsq5JP3qw2SKpmucWudry_FW0T3sbb1yi0'); 
  var dateScriptBegin    = new Date();    
  var spreadsheet        = SpreadsheetApp.openById("1uMK9iRudcrsq5JP3qw2SKpmucWudry_FW0T3sbb1yi0");
  var point              = "富戸";
  var sheet              = spreadsheet.getSheetByName(point);
  var response           = UrlFetchApp.fetch("http://www.izu-ito.jp/futo/info.html").getContentText("Shift_JIS");
  
  // 日時取得
  var regexpDate         = /size="\+1">([\s\S]*?)<\/font>/i;
  var tmpDate      = regexpDate.exec(response);
  var strDate            = tmpDate[1];
  
  // 海況取得 (脇の浜)
  var regexpStatusWakinohama         = /\d{1,2}:\d{1,2}\s脇の浜([\s\S]*?)<font color="blue">([\s\S]*?)<\/font>/i;
  var tmpStatusWakinohama      = regexpStatusWakinohama.exec(response);
  var strStatusWakinohama            = tmpStatusWakinohama[2];
  
  // 海況取得 (横浜)
  var regexpStatusYokobama         = /\d{1,2}:\d{1,2}\s横浜([\s\S]*?)<font color="blue">([\s\S]*?)<\/font>/i;
  var tmpStatusYokobama      = regexpStatusYokobama.exec(response);
  var strStatusYokobama            = tmpStatusYokobama[2];
  
  // 水温取得
  var regexpWaterTemp    = /（水　温）<\/td>([\s\S]*?)<td([\s\S]*?)"center">([\s\S]*?)<\/td>/i;  
  var tmpWaterTemp       = regexpWaterTemp.exec(response);
  var strWaterTemp       = tmpWaterTemp[3];
  
  // 透明度取得 (ビーチ&ボート)
  var regexpWaterClarityBeach = /（透明度）([\s\S]*?)ビーチ([\s\S]*?)<td nowrap>([\s\S]*?)<\/td><\/tr>([\s\S]*?)<\/td>([\s\S]*?)<td nowrap>([\s\S]*?)<\/td><\/tr>/i;
  var tmpWaterClarity         = regexpWaterClarityBeach.exec(response);
  var strWaterClarityBeach    = tmpWaterClarity[3]; // ビーチ
  var strWaterClarityBoat     = tmpWaterClarity[6]; // ボート  
  
  // 取得に要した時間計測
  var dateScriptEnd      = new Date();
  var strScriptTime      = ((dateScriptEnd - dateScriptBegin) / 1000 + "s");
  
  // 配列にまとめる
  var statuses = [
    [      
      strDate,
      strStatusWakinohama,
      strStatusYokobama,
      strWaterTemp,
      strWaterClarityBeach,
      strWaterClarityBoat,
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