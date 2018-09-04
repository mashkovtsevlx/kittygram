navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
var video = document.querySelector('video'), canvas;
var facingMode = "user";
var constraints = {
    audio: false,
    video: {
        facingMode: facingMode
    }
}

navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) {
    video.srcObject = stream;
});

video.addEventListener('click', function () {
    if (facingMode == "user") {
        $("#vid").css('-webkit-transform', 'scaleX(1)');
        $("#vid").css('transform', 'scaleX(1)');
        facingMode = "environment";
    } else {
        $("#vid").css('-webkit-transform', 'scaleX(-1)');
        $("#vid").css('transform', 'scaleX(-1)');
        facingMode = "user";
    }
    constraints = {
        audio: false,
        video: {
            facingMode: facingMode
        }
    }
    navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) {
        video.srcObject = stream;
    });
});

$(".take_shoot").element.addEventListener('click', function () {
    $('.take_shoot').css('background-color', '#ff8080');
    var context;
    var width = video.offsetWidth
        , height = video.offsetHeight;
    canvas = canvas || document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, width, height);
    $(".img").element.setAttribute('src', canvas.toDataURL("image/png"));
    var data = {};
    data['src'] = canvas.toDataURL("image/png");
    if ($('#selected_mask').attr('data-val') === '1')
    {
        data['mask'] = $('#selected_mask').element.src;
        data['maskheight'] = $('#selected_mask').outerHeight();
    }

    $('.take_shoot').ajax('POST', '/capture/save', data,
        function (request) {
            var resp = request.responseText;
            var iminfo = JSON.parse(resp);
            $('.take_shoot').css('background-color', 'transparent');
            document.body.style.cursor = 'default';
            $('.myphotos').element.innerHTML = '<div class="post"><div class="post-header"><img src="/upload/userimage/' + iminfo['userpic'] + '?v=' + Math.random() * (30000 - 0) + 0 + '" /><span>' + iminfo['username'] + '</span><a class="make_main" onclick="makemain(' + iminfo['name']['id'] + ')">Use as avatar</a></div><img class="main" src="/upload/userimage/' + iminfo['name']['name'] + '?v=' + Math.random() * (30000 - 0) + 0 + '" /><div class="post-footer"><img class="like" data-val="' + iminfo['name']['id'] + '" src="/images/ico/like.png" onclick="likeit(\' + iminfo[\'name\'][\'id\'] + \')" /><img class="delete" src="/images/ico/trash.png" /><span class="times-liked-text">This post liked <span class="times-liked" data-val="' + iminfo['name']['id'] + '">0</span> times</span></div><div class="post-comments"></div><div class="post-new-comment">​<textarea rows="2" data-val="' + iminfo['name']['id'] + '"></textarea><button onclick="send_comment(' + iminfo['name']['id'] + ')" type="button" class="btn btn-primary">Send</button></div></div>' + $('.myphotos').element.innerHTML;
        }, 1, 1, true);
});

function select_mask(name)
{
    mask = $('#selected_mask');
    vid = $('#vid');
    mask.attr('src', '../../images/masks/' + name);
    mask.css('height', vid.outerHeight() / 2 + 'px');
    mask.css('display', 'block');
    mask.attr('data-val', '1');
    mask.css('left', (vid.outerWidth() / 2 - mask.outerWidth() / 2) + 'px');
    mask.css('top', (vid.outerHeight() / 2 - mask.outerHeight() / 2)   + 'px');
}

function deselect_mask() {
    console.log('works');
    mask.attr('data-val', '0');
    $('#selected_mask').css('display', 'none');
}