﻿var $auth = (function () {

    let clientId = '';
    let secret = '';
    let response_type = 'code';
    let scope = 'https://www.googleapis.com/auth/photoslibrary';
    let access_type = 'offline';
    let returnUri = 'https://localhost:44394';
    let oauthurl = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=';
    let validurl = 'https://www.googleapis.com/oauth2/v2/tokeninfo?access_token=';
    let url = oauthurl + clientId + '&response_type=code&scope=' + scope + '&redirect_uri=' + returnUri + '&access_type=offline';
    var access_token = '';
    var code_auth = '';
    var refresh_token = '';

    alert(access_token);

    if (window.document.URL.indexOf("code") != -1) {
        code_auth = getUrlVars()['code'];
     //   validateToken(code_auth);
    }
    else if (access_token == '') {
        window.location = oauthurl + clientId + '&response_type=code&scope=' + scope + '&redirect_uri=' + returnUri + '&access_type=offline';


        var pollTimer = window.setInterval(function () {
            try {
                if (window.document.URL.indexOf(returnUri) != -1) {
                    code = geturlvars()['code'];
                    code_auth = code;
                    window.clearInterval(pollTimer);
                    var url = window.document.URL;
                    validateToken(code);
                    //acToken = gup(url, 'access_token');
                    //tokenType = gup(url, 'token_type');
                    //expiresIn = gup(url, 'expires_in');
                    //localStorage.setItem("access_token", access_token);
                    //localStorage.setItem("token_type", tokenType);
                    //localStorage.setItem("expires_in", expiresIn);
                    //win.close();
                    //validateToken(acToken);
               }
            } catch (e) {
                console.log(e.message);
            }
        }, 500);

    }

    function getUrlVars() {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');

            if ($.inArray(hash[0], vars) > -1) {
                vars[hash[0]] += "," + hash[1];
            }
            else {
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
        }

        return vars;
    }

    function validateToken(code) {

        $.ajax({
            url: "https://www.googleapis.com/oauth2/v2/token",
            data: {
                code: code,
                client_id: clientId,
                client_secret: secret,
                redirect_uri: returnUri,
                grant_type: "authorization_code"
            },
            method: "POST",
            success: function (e) {
                console.log("Response: " + e);
                console.log("AT: " + e['access_token']);
                console.log("RT: " + e['refresh_token']);
                access_token = e['access_token'];
                refresh_token = e['refresh_token'];

            }
        }).fail(function (err) {
            alert("error" + err); //[Object object]
            console.log("error" + err);
        });;

    }

    function gup(url, name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\#&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(url);
        if (results == null)
            return "";
        else
            return results[1];
    }

    function getUserInfo() {
        alert("C");
        $.ajax({
            url: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + acToken,
            data: null,
            success: function (resp) {
                user = resp;
                console.log(user);
                //$('#uName').text('Welcome ' + user.name);
                //$('#imgHolder').attr('src', user.picture);
            },
            dataType: "jsonp"
        });
    }

})();