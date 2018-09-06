function signup() {
    var email = $('.form-signup').element.elements.namedItem("email").value;
    var password = $('.form-signup').element.elements.namedItem("password").value;
    var re_password = $('.form-signup').element.elements.namedItem("re_password").value;
    var data = {};
    data['email'] = email;
    data['password'] = password;
    data['re_password'] = re_password;
    $('.form-signup').ajax('POST', '/user/signup', data,
        function (request) {
            var resp = request.responseText;
            $('.modal-signup .modal-footer').element.innerHTML = resp;
            document.body.style.cursor = 'default';
        },
        1, 1, true);
}

function login() {
    var email = $('.form-login').element.elements.namedItem("email").value;
    var password = $('.form-login').element.elements.namedItem("password").value;
    var data = {};
    data['email'] = email;
    data['password'] = password;
    $('.form-login').ajax('POST', '/user/login', data,
        function (request) {
            var resp = request.responseText.trim();
            document.body.style.cursor = 'default';
            if (resp.length <= 4)
                window.location.replace("/");
            else
            {
                $('.modal-login .modal-footer').element.innerHTML = resp;
            }
        },
        1, 1, true);
}

function forgot() {
    var email = $('.form-forgot').element.elements.namedItem("email").value;
    var password = $('.form-forgot').element.elements.namedItem("password").value;
    var re_password = $('.form-forgot').element.elements.namedItem("re_password").value;
    var data = {};
    data['email'] = email;
    data['password'] = password;
    data['re_password'] = re_password;
    $('.form-forgot').ajax('POST', '/user/forgot', data,
        function (request) {
            var resp = request.responseText;
            $('.modal-forgot .modal-footer').element.innerHTML = resp;
            document.body.style.cursor = 'default';
        },
        1, 1, true);
}

function settings()
{
    var username = $('.form-settings').element.elements.namedItem("username").value;
    var email = $('.form-settings').element.elements.namedItem("email").value;
    var password = $('.form-settings').element.elements.namedItem("password").value;
    var new_password = $('.form-settings').element.elements.namedItem("new_password").value;
    var re_password = $('.form-settings').element.elements.namedItem("re_password").value;
    var notifications = $('.form-settings').element.elements.namedItem("notifications").checked ? '1' : '0';
    var data = {};
    data['email'] = email;
    data['password'] = password;
    data['username'] = username;
    data['new_password'] = new_password;
    data['re_password'] = re_password;
    data['notifications'] = notifications;
    $('.form-login').ajax('POST', '/user/settings', data,
        function (request) {
            var resp = request.responseText;
            document.body.style.cursor = 'default';
            $('.modal-settings .modal-footer').element.innerHTML = resp;
            if (resp == '<span class="badge badge-success page-reload">Settings updated. Please, check your email and relogin<br />Page reloads in 3</span>')
                page_reload();
        },
        1, 1, true);
}

function logout()
{
    $('.form-login').ajax('POST', '/user/logout', 0,
        function (request) {
            window.location.replace("/");
        },
        1, 1, true);
}

function page_reload()
{
    var i = 3;
    setInterval(function () {
        $('.page-reload').element.innerHTML = 'Settings updated. Please, check your email and relogin<br />Page reloads in ' + i;
        i--;
    }, 1000);
    setTimeout(logout, 4000);
}

$(".user_profile").element.addEventListener('click', function () {
    var status = $('.myphotos').css('display');
    if (status == 'none')
    {
        $('.masks').css('display', 'none');
        $('#selected_mask').css('display', 'none');
        $('#selected_mask').attr('data-val', '0');
        $('.myphotos').css('display', 'block');
        $('.user_profile').css('background-color', 'lightblue');
    } else
    {
        $('.masks').css('display', 'block');
        $('#selected_mask').css('display', 'block');
        $('#selected_mask').attr('data-val', '1');
        $('.myphotos').css('display', 'none');
        $('.user_profile').css('background-color', 'transparent');
    }
});

function send_comment(id) {
    var data = {};
    data['id'] = id;
    data['comment'] = $('textarea[data-val="' + id + '"]').val();
    $('.myphotos').ajax('POST', '/capture/comment', data,
        function (request) {
            var resp = request.responseText;
            $('.post[data-val="' + id + '"] .post-comments').append('<div class="comment"><span class="comment-author">' + resp + ':</span><span class="comment-text">' + data['comment'] + '</span></div>');
            document.body.style.cursor = 'default';
        }, 1, 1, true);
}

function likeit(id) {
    var data = {};
    data['id'] = id;
    span_times_liked = $('span.times-liked[data-val="' + id + '"]');
    $('.myphotos').ajax('POST', '/capture/like', data,
        function (request) {
            var resp = request.responseText.trim();
            if (resp === '1') {
                $('img[data-val="' + id + '"]').attr('src', '/images/ico/like_red.png');
                span_times_liked.text(String(parseInt(span_times_liked.text()) + 1));
            }
            else {
                $('img[data-val="' + id + '"]').attr('src', '/images/ico/like.png');
                span_times_liked.text(String(parseInt(span_times_liked.text()) - 1));
            }
            document.body.style.cursor = 'default';
        }, 1, 1, true);
}

function deleteit(id) {
    var data = {};
    data['id'] = id;
    $('.myphotos').ajax('POST', '/capture/delete', data,
        function (request) {
            var resp = request.responseText.trim();
            if (resp === '1') {
                $('.post[data-val="' + id + '"]').remove();
            }
            document.body.style.cursor = 'default';
        }, 1, 1, true);
}

function makemain(id) {
    var data = {};
    data['id'] = id;
    $('.myphotos').ajax('POST', '/capture/makemain', data,
        function (request) {
            var resp = request.responseText.trim();
            if (resp === '1') {
                location.reload();
            }
            document.body.style.cursor = 'default';
        }, 1, 1, true);
}