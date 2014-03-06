// Skicka en notifikation så att personen
// kan autensiera sig för första gången
// Körs först, varje gång

setup();

function setup() {
  // Hämta värdet 'autenticated' från chrome.localstorage
    var autenticated = localStorage["authenticated"];
    if (autenticated === '1') {
        // Om autensierad förut, gör ingenting.
        first_commit();
    }
    else {
      // Värdet finns inte, personen har nyligen installerat
      // denna plugin alltså. Ge honom ett litet kort som tar honom
      // till setup.
      var notification = webkitNotifications.createNotification(
        '../img/icon-128.png','Kom igång','Autensiera dig med SchoolSoft'
      );

      // Visa notifikationen
      notification.show();

      // Användaren klickade på oss, skicka denne till setup.html !
      notification.onclick = function() {
        chrome.tabs.create({ url: 'setup.html' });
      }
    }
}

// Funktionen körs igenom 'setup.html'
// Denna funktion skall köras första gånger
// användaren startar tillägget, detta är för
// att värden skall sparas i det lokala minnet.
// Så vi kan jämföra den första datan mot ny och
// meddela användaren.
function first_commit(){

  // Hämtas användarens användaruppgifter, nu ska
  // vi logga in och spara alla värden!
  // Ajax anrop till inloggningssidan tillsammans med
  // användaruppgifterna.
  // Sparar användaruppgifterna till variabler
    var usertype = localStorage["usertype"];
    var username = localStorage["username"];
    var password = localStorage["password"];
    var server = localStorage["server"];

    var key = "" // Endast för deklaration
    var frameset = server.replace("/jsp/Login.jsp","/html/frameset.jsp");
    var student_right = server.replace("Login.jsp","student/right_student_startpage.jsp?") + key;
    //
    $.ajax({
    url: server,
    type: "GET",
    dataType: "html",
    success: function() {
        $.ajax({
          url: server,
          type: "POST",
          data: {
            "action": "login",
            "usertype": usertype,
            "button":"Logga in",
            "ssusername": username,
              "sspassword": password
            },
            dataType: "html",
            success: function() {
              $.ajax({
                url: frameset,
                type: "GET",
                dataType: "html",
              success: function(data) {
                var response = data.substring(562); // Ta bort grundläggande HTML och ta fram nyckeln
                window.key = response.substring(0, response.indexOf('"')); // Våran nyckel till att navigera på Schoolsoft
                // Låt oss nu spara datan från:
                // # Resultat
                // # Olästa meddelanden
                // # Nyhete
                $.ajax({
                    url: student_right,
                    type: "GET",
                    dataType: "html",
                    success: function(data) {
                      // Nyheter
                      var news_array = []; // Deklaration
                      var parsed = $.parseHTML(data);
                      $(parsed).find('#news_con_content > table tbody tr td a div.heading_bold').each( function(){
                        news_array.push($(this).text()); // Pusha in strängar i vår array
                      });
                      // Resultat
                      var result_array = []; // Deklaration
                      $(parsed).find('#week_results_con_content > table tbody tr div.heading_bold').each( function(){
                        result_array.push($(this).text()); // Pusha in strängar i vår array
                      });
                      // Olästa meddelanden
                      var messages_inbox = []; // Deklaration
                      $(parsed).find('#mess_con_content table tbody tr td a').each( function(){
                        messages_inbox.push($(this).text()); // Pusha in strängar i vår array
                      });
                      // Vi passa dessa variabler till 'save'
                      save(result_array, messages_inbox, news_array);
                      loop(); 
                  }
                });
              }
            });
          }
        });
      }
    });
  }

// 'first_commit' passerar argument in i mig, dom kollar
// jag mot den ursprungliga datan. Är den nyare, uppdaterar
// jag, annars så skiter vi i det.
function save(result_array, messages_inbox, news_array){
 
  // Najs, nu sparar vi dessa värden.
  localStorage["resultat"] = result_array;
  localStorage["meddelanden"] = messages_inbox;
  localStorage["nyheter"] = news_array;
  
}

function loop(){

  // Denna funktion ska hämta värden varje minut 
  // och kolla om de är likadana som de gamla. 
  // Stämmer dom inte överens så ska vi ge vår användare
  // en notifikation. Perfekt, då gör vi ett AJAX-anrop!
  var usertype = localStorage["usertype"];
  var username = localStorage["username"];
  var password = localStorage["password"];
  var server = localStorage["server"];

  var key = "" // Endast för deklaration
  var frameset = server.replace("/jsp/Login.jsp","/html/frameset.jsp");
  var student_right = server.replace("Login.jsp","student/right_student_startpage.jsp?") + key;
  //
  $.ajax({
  url: server,
  type: "GET",
  dataType: "html",
  success: function() {
      $.ajax({
        url: server,
        type: "POST",
        data: {
          "action": "login",
          "usertype": usertype,
          "button":"Logga in",
          "ssusername": username,
            "sspassword": password
          },
          dataType: "html",
          success: function() {
            $.ajax({
              url: frameset,
              type: "GET",
              dataType: "html",
            success: function(data) {
              var response = data.substring(562); // Ta bort grundläggande HTML och ta fram nyckeln
              window.key = response.substring(0, response.indexOf('"')); // Våran nyckel till att navigera på Schoolsoft
              // Låt oss nu spara datan från:
              // # Resultat
              // # Olästa meddelanden
              // # Nyheter
              $.ajax({
                  url: student_right,
                  type: "GET",
                  dataType: "html",
                  success: function(data) {
                    // Nyheter
                    var news_array = []; // Deklaration
                    var parsed = $.parseHTML(data);
                    $(parsed).find('#news_con_content > table tbody tr td a div.heading_bold').each( function(){
                      news_array.push($(this).text()); // Pusha in strängar i vår array
                    });
                    // Resultat
                    var result_array = []; // Deklaration
                    $(parsed).find('#week_results_con_content > table tbody tr div.heading_bold').each( function(){
                      result_array.push($(this).text()); // Pusha in strängar i vår array
                    });
                    // Olästa meddelanden
                    var messages_inbox = []; // Deklaration
                    $(parsed).find('#mess_con_content table tbody tr td a').each( function(){
                      messages_inbox.push($(this).text()); // Pusha in strängar i vår array
                    });
                    // Skicka de uppdaterade värdena till en funktion som kollar om de
                    // matchar eller ej!
                    checker(result_array, messages_inbox, news_array, key);
                }
              });
            }
          });
        }
      });
    }
  });
}

function checker(result_array, messages_inbox, news_array, key) {

  setInterval(function () {

  // Vi kollar result_array mot den i vår localstorage
  var oldResult = localStorage["resultat"];
  var oldMeddelanden = localStorage["meddelanden"];
  var oldNyheter = localStorage["nyheter"];
  if (result_array == oldResult) {
    // Gör inget, värdena har ej ändrats
  }
  else {
    // Värdena överensstämmer ej, meddela användaren
    var notification = webkitNotifications.createNotification(
        '../img/icon-128.png','Nya Resultat','Det finns nya resultat på SchoolSoft'
      );

      // Visa notifikationen
      notification.show();

      // Användaren klickade på oss, skicka denne till setup.html !
      notification.onclick = function() {
        chrome.tabs.create({ url: 'https://sms7.schoolsoft.se/nti/jsp/student/right_student_startpage.jsp?'+key });
      }

      // Nu uppdaterar vi vårat värde
      localStorage["resultat"] = result_array;
  }

  // Nu kollar vi våra meddelanden
  if (messages_inbox == oldMeddelanden){
    // Nada
  }
  else {
    // Värdena överensstämmer ej, meddela användaren
    localStorage["meddelanden"] = messages_inbox;
    
    var notification = webkitNotifications.createNotification(
        '../img/icon-128.png','Nytt meddelande', messages_inbox
      );

      // Visa notifikationen
      notification.show();

      // Användaren klickade på oss, skicka denne till setup.html !
      notification.onclick = function() {
        chrome.tabs.create({ url: 'https://sms7.schoolsoft.se/nti/jsp/student/right_student_message.jsp?'+key });
      }

      // Nu uppdaterar vi vårat värde
  }

  // Nu kollar vi våra nyheter
  if (news_array == oldNyheter){
    // Nada
  }
  else {
    // Värdena överensstämmer ej, meddela användaren
    var notification = webkitNotifications.createNotification(
        '../img/icon-128.png','Nyheter', 'Det finns nyheter ifrån din skola på SchoolSoft'
      );

      // Visa notifikationen
      notification.show();

      // Användaren klickade på oss, skicka denne till setup.html !
      notification.onclick = function() {
        chrome.tabs.create({ url: 'https://sms7.schoolsoft.se/nti/jsp/student/right_student_news.jsp?'+key });
      }

      // Nu uppdaterar vi vårat värde
      localStorage["nyheter"] = news_array;
  }

console.log("Running..");
}, 1000);

}