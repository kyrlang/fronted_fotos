var OAUTHURL = 'https://accounts.google.com/o/oauth2/auth?';
                https://www.googleapis.com/oauth2/v3/token
var VALIDURL = 'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=';
//var SCOPE = 'https://www.googleapis.com/auth/drive.photos.readonly https://www.googleapis.com/auth/photoslibrary https://www.googleapis.com/auth/photoslibrary.readonly https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/photoslibrary.appendonly https://www.googleapis.com/auth/photoslibrary.sharing';
var SCOPE =   'https://www.googleapis.com/auth/photoslibrary.readonly https://www.googleapis.com/auth/photoslibrary.appendonly https://www.googleapis.com/auth/photoslibrary.sharing profile';
var CLIENTID = '570343088582-fv94ns2tgse3sg08cs8tip7uuf5gjq47.apps.googleusercontent.com';
var SECRET = 'sWgD2cbpRDFyMBg37ITz_W7w';
var REDIRECT = 'http://localhost:6670'
//var REDIRECT = 'https://fotos-dd9d6.firebaseapp.com/'
var LOGOUT = 'http://accounts.google.com/Logout';
var TYPE = 'code';
var _url = OAUTHURL + 'scope=' + SCOPE + '&client_id=' + CLIENTID + '&redirect_uri=' + REDIRECT + '&response_type=' + TYPE;
var acToken;
var idToken;
var tokenType;
var expiresIn;
var user;
var loggedIn = false;

if (loggedIn == false) {

    $('#mensagemLogin').html("Usuário não autenticado");

}


function login() {
    if (window.document.URL.indexOf("code") != -1) {
        code_auth = getUrlVars();
        getToken(code_auth);
    }
    else if (window.document.URL.indexOf("code") == -1) {

        var win = window.open(_url, "windowname1", 'width=800, height=600');
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

            if (strMenu == '') {
                strMenu = "Você ainda não tem nenhum album no Google Photos"
            }

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

function criaralbum(album) {
    debugger;

    var imagensSeleciondas = new Array();
    var nomeAlbum = album;

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://photoslibrary.googleapis.com/v1/albums",
        "method": "POST",
        "dataType": 'json',
        "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + acToken,
            "Cache-Control": "no-cache"
        },
        "processData": false,
        "data": '{"album": {"title":"' + nomeAlbum + '"}}'
    }

    $.ajax(settings).done(function (response) {
        menu(acToken);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        alert("Error");
    });

}

function buscarAlbum() {
    $.ajax({
        url: "https://photoslibrary.googleapis.com/v1/albums",
        dataType: 'jsonp',
        headers: {
            "Access-Control-Allow-Origin": '*'
        },
        data: {
            pageSize: 20,
            access_token: acToken
        },
        method: "GET",
        success: function (e) {
            var strMenu = ''
            if (e.albums != undefined) {
                $.each(e.albums, (i, item) => {
                    if (item.title.indexOf($(txtAlbum).val()) != -1) {
                        strMenu += '<li><a data-toggle="collapse"  data-parent="#paginas" href="#album1"  onclick="javascript:exibir(\'' + item.id + '\'' + '\,\'' + item.title + '\'' + '\,\'' + acToken + '\')">' + item.title + '</a ></li > ';
                    }
                });
            }

            if (strMenu == '') {
                strMenu  = 'Nenhum album encontrado :(';
            }

            //$('#tituloFotos').html('<h2>Clique em um dos albuns listados para visualizar as imagens</h2>');

            $('#listaAlbum').html(strMenu);
            
        }
    }).fail(function (err) {
        console.log("error" + err);
    });

}

function upload() {

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://photoslibrary.googleapis.com/v1/uploads",
        "method": "POST",
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Bearer ya29.GlwCBmo9WMOvCNQlDO331HQOCvjcV6ujjtrDg0iNjHChp1W5JSmWpWdzWB0sQcRRcnX_5NaBzEVFBfFONC4Maa8dtRK-ybred12XKI4L8fsGEmbSLRcxaU5GamwvVA",
            "Cache-Control": "no-cache",
            "Postman-Token": "52f78b26-4e42-46c0-b839-8587ba488aae"
        }
    }

    $.ajax(settings).done(function (response) {
        console.log(response);
    });

}

$(function () {

    var form;
    $('#fileUpload').change(function (event) {
        form = new FormData();
        form.append('fileUpload', event.target.files[0], { type: "application/octet-stream" }); // para apenas 1 arquivo
        //var name = event.target.files[0].content.name; // para capturar o nome do arquivo com sua extenção
    });

    $('#btnEnviar').click(function () {

        criaralbum($(inputNomeAlbum2).val());

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://photoslibrary.googleapis.com/v1/uploads",
            "method": "POST",
            "headers": {
                "Authorization": "Bearer " + acToken,
                "Content-type": ": application/octet-stream",
                "X-Goog-Upload-File-Name": "teste",
                "Cache-Control": "no-cache",
                "Access-Control-Allow-Origin": '*'
            },
            "processData": false,
            "contentType": false,
            "mimeType": "multipart/form-data",
            "data": form
        }

        $.ajax(settings).done(function (response) {
            console.log(response);
        }).fail(function (err) {
            alert("Ocorreu um erro ao realizar o upload.");
        });
    });
});