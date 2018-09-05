var limit = 7;
var start = 0;
var activated = false;

function load_data(limit, start) {
    var data = {};
    data['limit'] = limit;
    data['start'] = start;
    $('.container').ajax('POST', '/main/loaddata', data,
        function (request) {
            var resp = request.responseText;
            var response = JSON.parse(resp);
            var comments = '';
            document.body.style.cursor = 'default';
            response.forEach(function (photo) {
                console.log(photo);
                if (photo['comments'])
                {
                    photo['comments'].forEach(function (comment) {
                        comments += '<div class="comment"><span class="comment-author">' + comment['username'] + ':</span><span class="comment-text">' + comment['comment'] + '</span></div>'
                    });
                }
                $('#load_data').element.innerHTML = $('#load_data').element.innerHTML + '<div class="post post-main"><div class="post-header"><img src="/upload/userimage/' + photo['userpic'] + '?v=' + Math.random() * (30000 - 0) + 0 + '" /><span>' + photo['username'] + '</span><a class="make_main" onclick="makemain(' + photo['name']['id'] + ')">Use as avatar</a></div><img class="main" src="/upload/userimage/' + photo['name']['name'] + '?v=' + Math.random() * (30000 - 0) + 0 + '" /><div class="post-footer"><img class="like" data-val="' + photo['name']['id'] + '" src="' + photo['like'] + '" onclick="likeit(' + photo['name']['id'] + ')" /><img class="delete" src="/images/ico/trash.png" /><span class="times-liked-text">This post liked <span class="times-liked" data-val="' + photo['name']['id'] + '">' + photo['likedtimes'] + '</span> times</span></div><div class="post-comments">' + comments + '</div><div class="post-new-comment">​<textarea rows="2" data-val="' + photo['name']['id'] + '"></textarea><button onclick="send_comment(' + photo['name']['id'] + ')" type="button" class="btn btn-primary">Send</button></div></div>';
            });
            activated = false;
        }, 1, 1, true);
    start = start + limit;
}
load_data(limit, start);
window.onscroll = function () {
    if (document.documentElement.scrollTop + document.documentElement.offsetHeight > $("#load_data").outerHeight() && activated == false) {
        activated = true;
        start = start + limit;
        setTimeout(function () {
            load_data(limit, start);
        }, 1000);
    }
}