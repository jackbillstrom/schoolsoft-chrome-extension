$(document).ready(function(){
    
    // =============
    //    DESIGN
    // =============
    $("a[data-next='step2']").click(function() {
        $(".step1").hide();
        $(".step2").show();
        $(".bar").css("width", "33%");
        $("#circleG").hide();
        $("#check").hide();
    });
    
    $("a[data-next='step3']").click(function() {
        $(".step2").hide();
        $(".step3").show();
        $(".bar").css("width", "66%");
    });
    
    $("a[data-next='test']").click(function(){
        $(".bar").css("width", "100%");
		var usertype = $("#usertype").val();
		var username = $("#username").val();
		var password = $("#password").val();
		var server = $("#server").val();
        $(this).hide();
        $("#circleG").show();
        try_prefs(usertype, username, password, server);
	});

    // Nu ska vi testa våra användaruppgifter
    function try_prefs(usertype, username, password, server) {
        var frameset = server.replace("/jsp/Login.jsp","/html/frameset.jsp");
        // Testar
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
                        // Inloggning lyckades, spara uppgifterna maybe ?
                        localStorage["usertype"] = usertype;
                        localStorage["username"] = username;
                        localStorage["password"] = password;
                        localStorage["server"] = server;
                        localStorage["authenticated"] = 1;
                        // Logga datan
                        console.log(data);
                        $("#circleG").hide();
                        $("#check").show();
                      }
                    });
                }
            });
        }
    });
  }
});              