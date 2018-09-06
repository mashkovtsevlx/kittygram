<?php
$num = file_get_contents("num.txt");
$num++;
file_put_contents("num.txt", $num);
$masks_dir = 'images/masks';
$masks_list = scandir($masks_dir);
array_shift($masks_list);
array_shift($masks_list);
?>

<div class="masks">
    <div class="masks-none" onclick="deselect_mask()">None</div>
    <?php
    foreach($masks_list as $mask) {
        if (strpos($mask, '.png'))
            echo '<img src="../../images/masks/' . $mask . '" alt="hey" onclick="select_mask(\'' . $mask . '\')" />';
    }
    ?>
</div>
<img id="selected_mask" src="" style="display: none" data-val="0" />
<video id="vid" autoplay="" muted="" playsinline=""></video>

<img class="img" style="display: none"/>
<img id="manualimg" />

<input type="file" id="manual" name="manual" accept="image/*" />
<div class="myphotos">
    <?php
    if (isset($page['username']) && $page['username'] != "")
        $username = $page['username'];
    else
        $username = $page['email'];
    if (isset($page['userpic']) && $page['userpic'] != "")
        $userpic = $page['userpic'];
    else
        $userpic = "userpic.png";
    foreach ($page['media'] as $img) {
        $images = '<div class="post"><div class="post-header"><img src="/upload/userimage/' . $userpic . '?v=' . $num . '" /><span>' . $username . '</span><a class="make_main" onclick="makemain(' . $img['id'] . ')">Use as avatar</a></div><img class="main" src="/upload/userimage/' . $img['name'] . '?v=' . $num . '" /><div class="post-footer">';
        if ($img['liked'] == true)
            $images = $images . '<img class="like" data-val="' . $img['id'] . '" src="/images/ico/like_red.png" onclick="likeit(' . $img['id'] . ')" />';
        else
            $images = $images . '<img class="like" data-val="' . $img['id'] . '" src="/images/ico/like.png" onclick="likeit(' . $img['id'] . ')" />';
        $images = $images . '<img class="delete" src="/images/ico/trash.png" /><span class="times-liked-text">This post liked <span class="times-liked" data-val="' . $img['id'] . '">' . $img['likes'] . '</span> times</span></div><div class="post-comments">';
        foreach ($img['comments'] as $comment) {
            $images = $images . '<div class="comment"><span class="comment-author">' . $comment['username'] . ':</span><span class="comment-text">' . $comment['comment'] . '</span></div>';
        }
        $images = $images . '</div><div class="post-new-comment">​<textarea rows="2" data-val="' . $img['id'] . '"></textarea><button onclick="send_comment(' . $img['id'] . ')" type="button" class="btn btn-primary">Send</button></div></div>';
        echo $images;
    }
    ?>
</div>