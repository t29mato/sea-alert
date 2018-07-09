function myFunction() {
  var response = UrlFetchApp.fetch("http://qiita.com");

  var myRegexp = /<title>([\s\S]*?)<\/title>/i;
  var match = myRegexp.exec(response.getContentText());
  var title = match[1];

  title = title.replace(/(^\s+)|(\s+$)/g, "");
  Logger.log(title);
}