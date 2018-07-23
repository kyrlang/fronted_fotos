var OAUTHURL = 'https://accounts.google.com/o/oauth2/auth?';
                https://www.googleapis.com/oauth2/v3/token
var VALIDURL = 'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=';
//var SCOPE = 'https://www.googleapis.com/auth/drive.photos.readonly https://www.googleapis.com/auth/photoslibrary https://www.googleapis.com/auth/photoslibrary.readonly https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata https://www.googleapis.com/auth/userinfo.profile';
var SCOPE =   'https://www.googleapis.com/auth/photoslibrary.readonly profile';
var CLIENTID = '570343088582-fv94ns2tgse3sg08cs8tip7uuf5gjq47.apps.googleusercontent.com';
var SECRET = 'sWgD2cbpRDFyMBg37ITz_W7w';
var REDIRECT = 'http://localhost:51197'
var LOGOUT = 'http://accounts.google.com/Logout';
var TYPE = 'code';
var _url = OAUTHURL + 'scope=' + SCOPE + '&client_id=' + CLIENTID + '&redirect_uri=' + REDIRECT + '&response_type=' + TYPE;
var acToken;
var idToken;
var tokenType;
var expiresIn;
var user;
var loggedIn = false;

if (window.document.URL.indexOf("code") != -1) {
    code_auth = getUrlVars();
    getToken(code_auth);
    //window.location = REDIRECT;
 //   menu(acToken);
}
else if (window.document.URL.indexOf("code") == -1) {

    var win = window.open(_url, "windowname1", 'width=800, height=600');
    //window.location = _url;
    var pollTimer = window.setInterval(function () {
        try {
            console.log(win.document.URL);
            if (win.document.URL.indexOf(REDIRECT) != -1) {

                window.clearInterval(pollTimer);
                var url = win.document.URL;
                win.close();
                code_auth = getUrlVars(url);
                getToken(code_auth);
            }
        } catch (e) {
        }
    }, 500);

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

function getToken(code) {
    $.ajax({
        url: "https://www.googleapis.com/oauth2/v3/token",
        data: {
            code: code,
            client_id: CLIENTID,
            client_secret: SECRET,
            redirect_uri: REDIRECT,
            grant_type: "authorization_code"
        },
        method: "POST",
        success: function (e) {
            acToken = e['access_token'];
            idToken = e['id_token'];
            validateToken(acToken);
            menu(acToken);
        }
    }).fail(function (err) {
        console.log("error" + err);
        });
}

function validateToken(token) {

    $.ajax({
        url: VALIDURL + token,
        data: null,
        success: function (responseText) {
            //getUserInfo(token);
            loggedIn = true;
        },
        dataType: "jsonp"
    });
}

function getUserInfo(token) {
    $.ajax({
        url: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + token,
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


function getUrlVars(url) {
    var vars = [], hash;
    //var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    var hashes = url.slice(window.location.href.indexOf('?') + 1).split('&');
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
    return vars[hash[0]];
}

function menu(token) {
    $.ajax({
        url: "https://photoslibrary.googleapis.com/v1/albums",
        dataType: 'jsonp',
        headers: {
            "Access-Control-Allow-Origin": '*'
        },
        data: {
            pageSize: 10,
            access_token: token
        },
        method: "GET",
        success: function (e) {
            console.log("Response: " + e);
            var strMenu = '';
            $.each(e.albums, (i, item) => {
                strMenu += '<li><a data-toggle="collapse"  data-parent="#paginas" href="#album1"  onclick="javascript:exibir(\'' + item.id + '\'' + '\,\'' + item.title + '\'' + '\,\'' + token + '\')">' + item.title + '</a ></li > ';
            });
            $('#menuVertical').html(strMenu);
        }
    }).fail(function (err) {
        console.log("error" + err);
    });

}

function exibir(id, album, token) {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://photoslibrary.googleapis.com/v1/mediaItems:search",
        "method": "POST",
        "dataType": 'json',
        "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
            "Cache-Control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify({ "albumId": id })
    }

    $.ajax(settings).done(function (response) {
        console.log(response);
        var strFotos = '<h2>' + album + '</h2>'
        $.each(response.mediaItems, (i, item) => {
            strFotos += '<div class="col-lg-3 col-md-12 col-sm-2 col-xs-12"><img class="img-responsive img-thumbnail profile-pic-h" src=\'' + item.baseUrl + '\' /></div>';
        });
        $('#albumFotos').html(strFotos);

    }).fail(function (jqXHR, textStatus, errorThrown) {
        alert("Error");
    });


 
}

function listarFotos() {

    var strFotos = '<h2>Google Photos - Selecione as fotos para criar um novo album</h2>';
    
        $.ajax({
            url: "https://photoslibrary.googleapis.com/v1/albums",
            dataType: 'jsonp',
            headers: {
                "Access-Control-Allow-Origin": '*'
            },
            data: {
                pageSize: 10,
                access_token: acToken
            },
            method: "GET",
            success: function (e) {
                $.each(e.albums, (i, item) => {

                    var settings = {
                        "async": true,
                        "crossDomain": true,
                        "url": "https://photoslibrary.googleapis.com/v1/mediaItems:search",
                        "method": "POST",
                        "dataType": 'json',
                        "headers": {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + acToken,
                            "Cache-Control": "no-cache"
                        },
                        "processData": false,
                        "data": JSON.stringify({ "albumId": item.id })
                    }

                    $.ajax(settings).done(function (response) {

                        if (response.mediaItems != undefined) {
                            $.each(response.mediaItems, (i, item) => {
                                strFotos += '<div class="col-lg-3 col-md-12 col-sm-2 col-xs-12" nopad text-center>'
                                    + ' <label class="image-checkbox">'
                                    + ' <img class="img-responsive img-thumbnail profile-pic-h" src =\'' + item.baseUrl + '\' />'
                                    + ' <input type="checkbox" name="image[]" value=\'' + item.id + '\' /> '
                                    + ' <i class="fa fa-check hidden"></i>'
                                    + ' </label>'
                                    + ' </div >';
                                    
                            });


                            $('#listaFotos').html(strFotos);
                            $(init);

                        }

                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        alert("Error");
                    });
                });


            }
        }).fail(function (err) {
            console.log("error" + err);
        });



    

}

function criaralbum() {
    debugger;

    var imagensSeleciondas = new Array();
    var nomeAlbum = $(inputNomeAlbum).val();


    $(".image-checkbox").each(function () {

        var $checkbox = $(this).find('input[type="checkbox"]');
        if ($checkbox.prop("checked") == true) {
            imagensSeleciondas.push($checkbox.val());
            alert("criaralbum");
        }
    });

}







//var $auth = (function () {

//    let clientId = '570343088582-fv94ns2tgse3sg08cs8tip7uuf5gjq47.apps.googleusercontent.com';
//    let secret = 'sWgD2cbpRDFyMBg37ITz_W7w';
//    let response_type = 'code';
//    let scope = 'https://www.googleapis.com/auth/photoslibrary';
//    let access_type = 'offline';
//    let returnUri = 'https://localhost:44394';
//    let oauthurl = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=';
//    let validurl = 'https://www.googleapis.com/oauth2/v2/tokeninfo?access_token=';
//    let url = oauthurl + clientId + '&response_type=code&scope=' + scope + '&redirect_uri=' + returnUri + '&access_type=offline';
//    var access_token = '';
//    var code_auth = '';
//    var refresh_token = '';

    
//    if (window.document.URL.indexOf("code") != -1) {
//        code_auth = getUrlVars()['code'];
//       // validateToken(code_auth);
//        //window.location = returnUri;
//    //}
//    //else if (localStorage.getItem("access_token") == null) {

//        window.location = oauthurl + clientId + '&response_type=code&scope=' + scope + '&redirect_uri=' + returnUri + '&access_type=offline';

//        var pollTimer = window.setInterval(function () {
//            try {
//                if (window.document.URL.indexOf(returnUri) != -1) {
//                    code = geturlvars()['code'];
//                    code_auth = code;
//                    window.clearInterval(pollTimer);
//                    var url = window.document.URL;
//                    //validateToken(code);
//                    //acToken = gup(url, 'access_token');
//                    //tokenType = gup(url, 'token_type');
//                    //expiresIn = gup(url, 'expires_in');
//                    //localStorage.setItem("access_token", access_token);
//                    //localStorage.setItem("token_type", tokenType);
//                    //localStorage.setItem("expires_in", expiresIn);
//                    //win.close();
//                    //validateToken(acToken);
//                }
//            } catch (e) {
//                console.log(e.message);
//            }
//        }, 500);

//    }

//    function getUrlVars() {
//        var vars = [], hash;
//        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
//        for (var i = 0; i < hashes.length; i++) {
//            hash = hashes[i].split('=');

//            if ($.inArray(hash[0], vars) > -1) {
//                vars[hash[0]] += "," + hash[1];
//            }
//            else {
//                vars.push(hash[0]);
//                vars[hash[0]] = hash[1];
//            }
//        }

//        return vars;
//    }

//    function validateToken(code) {

//        $.ajax({
//            url: "https://www.googleapis.com/oauth2/v3/token",
//            data: {
//                code: code,
//                client_id: clientId,
//                client_secret: secret,
//                redirect_uri: returnUri,
//                grant_type: "authorization_code"
//            },
//            method: "POST",
//            success: function (e) {
//                console.log("Response: " + e);
//                console.log("AT: " + e['access_token']);
//                console.log("RT: " + e['refresh_token']);
//                access_token = e['access_token'];
//                refresh_token = e['refresh_token'];
//                localStorage.setItem("access_token", access_token)
//            }
//        }).fail(function (err) {
//            alert("error" + err); //[Object object]
//            console.log("error" + err);
//        });;

//    }

//    function gup(url, name) {
//        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
//        var regexS = "[\\#&]" + name + "=([^&#]*)";
//        var regex = new RegExp(regexS);
//        var results = regex.exec(url);
//        if (results == null)
//            return "";
//        else
//            return results[1];
//    }

//    function getUserInfo() {
//        alert("C");
//        $.ajax({
//            url: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + acToken,
//            data: null,
//            success: function (resp) {
//                user = resp;
//                console.log(user);
//                //$('#uName').text('Welcome ' + user.name);
//                //$('#imgHolder').attr('src', user.picture);
//            },
//            dataType: "jsonp"
//        });
//    }

//})();


