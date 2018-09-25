function formatDate() {
  // 参考サイト
  // https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/If-Modified-Since
  // http://tacamy.hatenablog.com/entry/2013/03/14/220831
  
  // 今日の日付で Date オブジェクトを作成
  var nowJST = new Date();
  var nowGMT = new Date(nowJST.getYear(), nowJST.getMonth(), nowJST.getDate(), nowJST.getHours() - 9);
  
  // 「年」「月」「日」「曜日」を Date オブジェクトから取り出してそれぞれに代入
  var year = nowGMT.getFullYear();
  var month = nowGMT.getMonth();
  var day = nowGMT.getDate();
  var week = nowGMT.getDay();
  var hours = nowGMT.getHours();
  var minutes = nowGMT.getMinutes();
  var seconds = nowGMT.getSeconds();
  
  // 曜日の表記を文字列の配列で指定
  var wNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // 月の表きを文字列の廃棄で指定
  var mNames = ['Jan', 'Feb', 'Mar', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  // 「月」と「日」で1桁だったときに頭に 0 をつける
  if (day < 10) {
    day = '0' + day;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  
  // フォーマットを整形して出力
  return wNames[week] + ', ' + day + ' ' + mNames[month] + ' ' + year + ' ' + hours + ':' + minutes + ':' + seconds + ' GMT';
}
