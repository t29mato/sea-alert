function Futo() {
  // 初期化
  var dateScriptBegin    = new Date();    
  var spreadsheet        = SpreadsheetApp.openById("1uMK9iRudcrsq5JP3qw2SKpmucWudry_FW0T3sbb1yi0");
  var sheet              = spreadsheet.getSheetByName("Futo");
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
  var tmpWaterClarityBeach    = regexpWaterClarityBeach.exec(response);
  Logger.log(tmpWaterClarityBeach[3]); // ビーチ
  Logger.log(tmpWaterClarityBeach[6]); // ボート
  var strWaterClarityBeach    = tmpWaterClarityBeach[2];

  // 取得した値をログ出力
  Logger.log(strDate);
  Logger.log(strStatusWakinohama);
  Logger.log(strStatusYokobama);
  Logger.log(strWaterTemp);
  Logger.log(strWaterClarityBeach);
  

  // 取得に要した時間計測
  var dateScriptEnd      = new Date();
  var strScriptTime      = ((dateScriptEnd - dateScriptBegin) / 1000 + "s");
  
  // 配列にまとめる
  var statuses = [
    strDate,
    strStatusWakinohama,
    strStatusYokobama,
    strWaterTemp,
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