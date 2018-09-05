navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
var video = document.querySelector('video'),
    canvas;
var facingMode = "user";
var videoavailable = true;
var manualimageready = false;
var constraints = {
    audio: false,
    video: {
        facingMode: facingMode
    }
}
if (!navigator.getUserMedia)
{
    $('#manual').css('display', 'block');
    videoavailable = false;
}
navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) {
    video.srcObject = stream;
}).catch(function (err) {
    $('#manual').css('display', 'block');
    videoavailable = false;
});

$('#manual').element.addEventListener('change', function() {
    var file = $('#manual').element.files[0];
    alert(file);
    var reader = new FileReader();
    reader.addEventListener("load", function () {
        var counter = 0;
        alert(reader.result);
        $("#manualimg").element.setAttribute('src', reader.result);
        $("#manualimg").css('display', 'block');
        setTimeout(function(){
            console.log($("#manualimg").element.offsetHeight);
            var ratio = $("#manualimg").outerHeight() / $("#manualimg").outerWidth();
            console.log(ratio);
            var basewidth = 600;
            var baseheight = basewidth * ratio;
            if (baseheight != 0 && basewidth != 0)
                manualimageready = true;
            else
                manualimageready = false;
    
            var context;
            canvas = canvas || document.createElement('canvas');
            canvas.width = basewidth;
            canvas.height = baseheight;
            context = canvas.getContext('2d');
            context.drawImage($("#manualimg").element, 0, 0, basewidth, baseheight);
            console.log(canvas.toDataURL("image/png"));
        }, 1000);
    }, false);
    if (file) {
        reader.readAsDataURL(file);
    }
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
    var data = {};
    if ($('#selected_mask').attr('data-val') === '1') {
        data['mask'] = $('#selected_mask').element.src;
        data['maskheight'] = $('#selected_mask').outerHeight() / $('#manualimg').outerHeight() * 400;
        console.log(data['maskheight']);
    }
    alert(videoavailable);
    alert(manualimageready);
    if (videoavailable == true) {
        var context;
        var width = video.offsetWidth,
            height = video.offsetHeight;
        canvas = canvas || document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, width, height);
        $(".img").element.setAttribute('src', canvas.toDataURL("image/png"));
        data['src'] = canvas.toDataURL("image/png");
        $('.take_shoot').ajax('POST', '/capture/save', data,
        function (request) {
            var resp = request.responseText;
            var iminfo = JSON.parse(resp);
            $('.myphotos').element.innerHTML = '<div class="post"><div class="post-header"><img src="/upload/userimage/' + iminfo['userpic'] + '?v=' + Math.random() * (30000 - 0) + 0 + '" /><span>' + iminfo['username'] + '</span><a class="make_main" onclick="makemain(' + iminfo['name']['id'] + ')">Use as avatar</a></div><img class="main" src="/upload/userimage/' + iminfo['name']['name'] + '?v=' + Math.random() * (30000 - 0) + 0 + '" /><div class="post-footer"><img class="like" data-val="' + iminfo['name']['id'] + '" src="/images/ico/like.png" onclick="likeit(\' + iminfo[\'name\'][\'id\'] + \')" /><img class="delete" src="/images/ico/trash.png" /><span class="times-liked-text">This post liked <span class="times-liked" data-val="' + iminfo['name']['id'] + '">0</span> times</span></div><div class="post-comments"></div><div class="post-new-comment">​<textarea rows="2" data-val="' + iminfo['name']['id'] + '"></textarea><button onclick="send_comment(' + iminfo['name']['id'] + ')" type="button" class="btn btn-primary">Send</button></div></div>' + $('.myphotos').element.innerHTML;
            $('.take_shoot').css('background-color', 'transparent');
            document.body.style.cursor = 'default';
        }, 1, 1, true);
    } else if (manualimageready) {
        var file = $('#manual').element.files[0];
        var reader = new FileReader();

        reader.addEventListener("load", function () {
            $(".img").element.setAttribute('src', reader.result);
            data['src'] = canvas.toDataURL("image/png");
            $('.take_shoot').ajax('POST', '/capture/save', data,
                function (request) {
                    var resp = request.responseText;
                    var iminfo = JSON.parse(resp);
                    $('.myphotos').element.innerHTML = '<div class="post"><div class="post-header"><img src="/upload/userimage/' + iminfo['userpic'] + '?v=' + Math.random() * (30000 - 0) + 0 + '" /><span>' + iminfo['username'] + '</span><a class="make_main" onclick="makemain(' + iminfo['name']['id'] + ')">Use as avatar</a></div><img class="main" src="/upload/userimage/' + iminfo['name']['name'] + '?v=' + Math.random() * (30000 - 0) + 0 + '" /><div class="post-footer"><img class="like" data-val="' + iminfo['name']['id'] + '" src="/images/ico/like.png" onclick="likeit(\' + iminfo[\'name\'][\'id\'] + \')" /><img class="delete" src="/images/ico/trash.png" /><span class="times-liked-text">This post liked <span class="times-liked" data-val="' + iminfo['name']['id'] + '">0</span> times</span></div><div class="post-comments"></div><div class="post-new-comment">​<textarea rows="2" data-val="' + iminfo['name']['id'] + '"></textarea><button onclick="send_comment(' + iminfo['name']['id'] + ')" type="button" class="btn btn-primary">Send</button></div></div>' + $('.myphotos').element.innerHTML;
                    $('.take_shoot').css('background-color', 'transparent');
                    document.body.style.cursor = 'default';
                }, 1, 1, true);
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
        document.body.style.cursor = 'default';
    }
    else
    {
        $('.take_shoot').css('background-color', 'orange');
    }
});

function select_mask(name) {
    mask = $('#selected_mask');
    vid = videoavailable ? $('#vid') : $('#manualimg');
    mask.attr('src', '../../images/masks/' + name);
    mask.css('height', vid.outerHeight() / 2 + 'px');
    mask.css('display', 'block');
    mask.attr('data-val', '1');
    mask.css('left', (vid.outerWidth() / 2 - mask.outerWidth() / 2) + 'px');
    mask.css('top', (vid.outerHeight() / 2 - mask.outerHeight() / 2 + 125) + 'px');
}

function deselect_mask() {
    console.log('works');
    mask.attr('data-val', '0');
    $('#selected_mask').css('display', 'none');
}