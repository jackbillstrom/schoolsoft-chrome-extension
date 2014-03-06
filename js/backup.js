

chrome.storage.onChanged.addListener(
  function(changes, namespace) {
    console.log(changes);
  }
);

function showNotisMessage(stringSend, array){
  stringClean = stringSend.replace("{\"messages\":\"","").replace("\"}",""); 
  var notification = webkitNotifications.createNotification(
    'icon-128.png',
    'SchoolSoft',
    stringClean
    );

  notification.show();

  notification.onclick = function() {
    var newURL = "https://sms7.schoolsoft.se/nti/jsp/student/right_student_startpage.jsp?"+array[0];
    chrome.tabs.create({ url: newURL });
  }

  if (webkitNotifications){
    //
  }
  else {
    console.log("No support");
  }
}


rerun();

function rerun(){
  $.ajax({
    url: "https://sms7.schoolsoft.se/nti/jsp/Login.jsp",
    type: "GET",
    dataType: "html",
    success: function() {
        $.ajax({
            url: "https://sms7.schoolsoft.se/nti/jsp/Login.jsp",
            type: "POST",
            data: {
                    "action": "login",
                    "usertype": 1,
                    "button":"Logga in",
                    "ssusername": "jabi",
                    "sspassword": "sKg8q5ck"
            },
            dataType: "html",
            success: function() {
                $.ajax({
                  url: "https://sms7.schoolsoft.se/nti/html/frameset.jsp",
                  type: "GET",
                  dataType: "html",
                  success: function(data) {
                      var reso = data.substring(562);
                      var redo = reso.substring(0, reso.length - 160);
                      var trim = redo.replace("<frame src=\"../jsp/student/right_student_startpage.jsp?","").replace("noresize scrolling=\"AUTO\" name=\"top_menu\" marginwidth=\"0\" frameborder=\"0\">","").replace(/\s+/g, '').replace("\"",",");
                      var array = trim.split(",");
                      //console.log(array);
                      getMyNigguh(array);
                      getNews(array);
                      getMessages(array);
                  }
              });
          }
      });
    }
  });

  setTimeout(rerun, 60000);
}

  function getMyNigguh(array) {
    $.ajax({
        url: "https://sms7.schoolsoft.se/nti/jsp/student/right_student_startpage.jsp?"+array[1],
        type: "GET",
        dataType: "html",
          success: function(data) {
              // Resultat
              var dickhead = data.search("<div class=\"heading_bold\">");
              var strip = data.substring(0, data.length - 50527);
              var quot = /&quot;/gi; var nbsp = /&nbsp;/gi; var csslass = /class=/gi; var starship = /">/gi; var heading_bold = /heading_bold/gi;
              var stripping = data.substring(dickhead).replace(nbsp," ").replace(quot," ").replace("<div>","").replace("</div>","").replace("<div","").replace(csslass,"").replace(starship,"").replace(heading_bold,"").replace("<div class\"commentKlicka för att visa resultat</div>","").replace("\"","");
              var html = $.parseHTML(data); 
              var motherfucker = $(html).find('#week_results_con_content > table tbody tr div.heading_bold');
              result = ($(motherfucker).text());
              var key = "result",
                 testPrefs = JSON.stringify({
                    'result': result
                 });
                var jsonfile = {};
                jsonfile[key] = testPrefs;
                chrome.storage.sync.set(jsonfile, function () {
                    console.log('Saved', key, testPrefs);
                });
          }
    });
  }

  function getNews(array) {
    $.ajax({
        url: "https://sms7.schoolsoft.se/nti/jsp/student/right_student_startpage.jsp?"+array[1],
        type: "GET",
        dataType: "html",
          success: function(data) {
              // Nyheter
              var html = $.parseHTML(data); 
              var fatherfucker = $(html).find('#news_con_content > table tbody tr td a div');
                news = ($(fatherfucker).text());
                newsjson = testPrefs = JSON.stringify({
                    'news': news
                 });
                newsLength = newsjson.length;
                //console.log(newsjson);
                initial(newsLength, array);
              /*var key = "news",
                 testPrefs = JSON.stringify({
                    'news': news
                 });
                var jsonfile = {};
                jsonfile[key] = testPrefs;
                chrome.storage.sync.set(jsonfile, function () {
                    console.log('Saved', key, testPrefs);
                });*/
          }
    });
  }

  function getMessages(array) {
    $.ajax({
        url: "https://sms7.schoolsoft.se/nti/jsp/student/right_student_message.jsp?"+array[1],
        type: "GET",
        dataType: "html",
          success: function(data) {
              // Nyheter
              var html = $.parseHTML(data); 
              var sunfucker = $(html).find('#mess_con_content table tbody tr td a');
                string = $(sunfucker).text();
                baby = string.length;
                 //console.log($(this).text());
                 var key = "messages",
                 testPrefs = JSON.stringify({
                    'messages': string
                 });
                var jsonfile = {};
                jsonfile[key] = testPrefs;
                chrome.storage.sync.set(jsonfile, function () {
                    console.log('Saved', key, testPrefs);
                    checker(baby, array);
                });
          }
    });
  }


  function initial(newsLength){
    chrome.storage.sync.get(null, function(data) {
      var allKeys = Object.keys(data);
      console.log(data.news);
      dataLengd = data.news.length;
      if (dataLengd == newsLength){
        console.log("På School fronten, inget nytt!");
      }
      else {
        console.log(dataLengd);
        console.log(newsLength);
        // Kasta ett nyhetskort på oss!
        var notification = webkitNotifications.createNotification(
        'icon-128.png',
        'SchoolSoft',
        'Det finns olästa nyheter på SchoolSoft'
        );

      notification.show();
          }
        });

    update();
    }

    function update(){

    }

  function checker(baby, array){
    console.log(baby);
    chrome.storage.sync.get(null, function(data) {
      var allKeys = Object.keys(data);
      //console.log(data.messages);
      stringSend = data.messages;
      if (baby > 1) {
        showNotisMessage(stringSend, array)
      }
      else {
      }
    });
  }