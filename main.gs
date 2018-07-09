function myFunction() {
  var dateScriptBegin    = new Date();    
  var spreadsheet        = SpreadsheetApp.openById("1uMK9iRudcrsq5JP3qw2SKpmucWudry_FW0T3sbb1yi0");
  var sheet              = spreadsheet.getSheetByName("IOP");
  var response           = UrlFetchApp.fetch("http://iop-dc.com");
  
  var regexpDateStatus   = /<dt>([\s\S]*?)の海況<\/dt>([\s\S]*?)<dd>([\s\S]*?)<\/dd>/i;
  var tmpDateStatus      = regexpDateStatus.exec(response.getContentText());
  var strDate            = tmpDateStatus[1];
  var strStatus          = tmpDateStatus[3];
  
  var regexpWaterTemp    = /<h4>水温<\/h4>([\s\S]*?)<dd>([\s\S]*?)<\/dd>/i;
  var tmpWaterTemp       = regexpWaterTemp.exec(response.getContentText());
  var strWaterTemp       = tmpWaterTemp[2];
  
  var regexpWaterClarity = /<h4>透視度<\/h4>([\s\S]*?)<dd>([\s\S]*?)<\/dd>/i;
  var tmpWaterClarity    = regexpWaterClarity.exec(response.getContentText());
  var strWaterClarity    = tmpWaterClarity[2];
  
  Logger.log(strDate);
  Logger.log(strStatus);
  Logger.log(strWaterTemp);
  Logger.log(strWaterClarity);
  
  var statuses = [
    strDate,
    strStatus,
    strWaterTemp,
    strWaterClarity
  ];
  
  for (var i = 0; i < statuses.length; i += 1) {
    sheet.getRange(2, i + 1).setValue(statuses[i]);
  }
  
  var dateScriptEnd = new Date();
  Logger.log((dateScriptEnd - dateScriptBegin) / 1000 + "s");
}