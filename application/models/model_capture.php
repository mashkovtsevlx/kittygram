<?php
class Model_Capture extends Model
{
    public $page;
    public function __construct($page = null)
    {
        $this->page = $page;
    }
    private function imageflip(&$image, $x = 0, $y = 0, $width = null, $height = null)
    {
        if ($width  < 1) $width  = imagesx($image);
        if ($height < 1) $height = imagesy($image);
        if (function_exists('imageistruecolor') && imageistruecolor($image))
        {
            $tmp = imagecreatetruecolor(1, $height);
        }
        else
        {
            $tmp = imagecreate(1, $height);
        }
        $x2 = $x + $width - 1;
        for ($i = (int) floor(($width - 1) / 2); $i >= 0; $i--)
        {
            imagecopy($tmp,   $image, 0,        0,  $x2 - $i, $y, 1, $height);
            imagecopy($image, $image, $x2 - $i, $y, $x + $i,  $y, 1, $height);
            imagecopy($image, $tmp,   $x + $i,  $y, 0,        0,  1, $height);
        }
        imagedestroy($tmp);
        return true;
    }
    public function save($source, $email, $mask, $height, $facingmode)
    {
        date_default_timezone_set('Europe/Kiev');
        $data = base64_decode($source);
        $msg = array();
        $db = Db::getInstance();
        $query = $db->prepare("SELECT id FROM users WHERE email = :username");
        $query->execute(array(':username' => $email));
        if ($query->rowCount() > 0) {
            $result = $query->fetch(PDO::FETCH_ASSOC);
            $i = 1;
            while (True) {
                if (file_exists("upload/userimage/" . $i . ".png"))
                    $i++;
                else
                    break;
            }
            file_put_contents("upload/userimage/" . $i . ".png", $data);
            if ($facingmode === 'user')
            {
                $image_pre = imagecreatefrompng('upload/userimage/'.$i.'.png');
                $this->imageflip($image_pre);
                imagepng($image_pre, 'upload/userimage/'.$i.'.png');
            }
            if ($mask != null)
            {
                $dimensions = getimagesize("upload/userimage/" . $i . ".png");
                $image1 = imagecreatefrompng('upload/userimage/'.$i.'.png');
                $image2 = imagecreatefrompng($mask);
                imagecopyresized($image1, $image2, $dimensions[0] / 2 - $height / 2, $dimensions[1] / 2 - $height / 2, 0, 0, $height, $height, 400, 400);
                imagepng($image1, 'upload/userimage/'.$i.'.png');
            }
            $query = $db->prepare("INSERT INTO photos(name, created, user_id) VALUES(:name, now(), :id)");
            $query->execute(array(':name' => $i . ".png", ':id' => $result['id']));
            $query = $db->prepare('SELECT id FROM photos WHERE name = :name');
            $query->execute(array(':name' => $i . '.png'));
            $im = $query->fetch(PDO::FETCH_ASSOC);
            $msg['name'] = $i . ".png";
            $msg['id'] = $im['id'];
        }
        return $msg;
    }
    public function getmedia($email)
    {
        $db = Db::getInstance();
        $query = $db->prepare("SELECT id FROM users WHERE email = :username");
        $query->execute(array(':username' => $email));
        if ($query->rowCount() > 0) {
            $result = $query->fetch(PDO::FETCH_ASSOC);
            $page = array();
            $query = $db->prepare("SELECT name, id FROM photos WHERE user_id = :id ORDER BY created DESC");
            $query->execute(array(':id' => $result['id']));
            while ($img = $query->fetch(PDO::FETCH_ASSOC)) {
                $query_likes = $db->prepare("SELECT id FROM likes WHERE photo_id = :id AND user_id = :u_id");
                $query_likes->execute(array(':id' => $img['id'], ':u_id' => $result['id']));
                if ($query_likes->rowCount() > 0)
                    $is_liked = true;
                else
                    $is_liked = false;
                $query_likes = $db->prepare("SELECT id FROM likes WHERE photo_id = :id");
                $query_likes->execute(array(':id' => $img['id']));
                $query_comments = $db->prepare("SELECT user_id, comment FROM comments WHERE photo_id = :id");
                $query_comments->execute(array(':id' => $img['id']));
                $comments = array();
                while ($comment = $query_comments->fetch(PDO::FETCH_ASSOC)) {
                    $query = $db->prepare("SELECT email, username FROM users WHERE id = :id");
                    $query->execute(array(':id' => $comment['user_id']));
                    $user = $query->fetch(PDO::FETCH_ASSOC);
                    if (isset($user['username']) && $user['username'] != "")
                        $username = $user['username'];
                    else
                        $username = $user['email'];
                    $comnt = array();
                    $comnt['username'] = $username;
                    $comnt['comment'] = $comment['comment'];
                    $comments[] = $comnt;
                }
                $imgdata = array();
                $imgdata['id'] = $img['id'];
                $imgdata['name'] = $img['name'];
                $imgdata['liked'] = $is_liked;
                $imgdata['likes'] = $query_likes->rowCount();
                $imgdata['comments'] = $comments;
                $page[] = $imgdata;
            }
            return $page;
        } else {
            return NULL;
        }
    }
    public function comment($user, $id, $comment)
    {
        $db = Db::getInstance();
        $query = $db->prepare("SELECT id, username FROM users WHERE email = :user");
        $query->execute(array(':user' => $user));
        $user = $query->fetch(PDO::FETCH_ASSOC);
        $query = $db->prepare("INSERT INTO comments(photo_id, user_id, comment) VALUES(:photo_id, :user_id, :comment)");
        $query->execute(array(':photo_id' => $id, ':user_id' => $user['id'], ':comment' => $comment));
        $commentedUser = $this->getUserByPhotoId($id);
        $to=$commentedUser['email'];
        $subject="New comment on your photo";
        $body='Hi! <br/> <br/><b>'.$user['username'].'</b> commented your photo: <br /><i>"'.$comment.'"</i>';
        Send_Mail($to,$subject,$body);
        return $user['username'];
    }
    public function like($user, $id)
    {
        $db = Db::getInstance();
        $query = $db->prepare("SELECT id FROM users WHERE email = :user");
        $query->execute(array(':user' => $user));
        $user = $query->fetch(PDO::FETCH_ASSOC);
        $query = $db->prepare("SELECT id FROM likes WHERE photo_id = :photo AND user_id = :user");
        $query->execute(array(':photo' => $id, ':user' => $user['id']));
        if ($query->rowCount() > 0) {
            $query = $db->prepare("DELETE FROM likes WHERE photo_id = :photo AND user_id = :user");
            $query->execute(array(':photo' => $id, ':user' => $user['id']));
            return '0';
        } else {
            $query = $db->prepare("INSERT INTO likes (photo_id, user_id) VALUES (:photo_id, :user_id)");
            $query->execute(array(':photo_id' => $id, ':user_id' => $user['id']));
            return '1';
        }
    }
    public function delete($user, $id)
    {
        $db = Db::getInstance();
        $query = $db->prepare("SELECT id FROM users WHERE email = :user");
        $query->execute(array(':user' => $user));
        $user = $query->fetch(PDO::FETCH_ASSOC);
        $query = $db->prepare("SELECT id, name FROM photos WHERE id = :photo AND user_id = :user");
        $query->execute(array(':photo' => $id, ':user' => $user['id']));
        if ($query->rowCount() > 0) {
            $photo = $query->fetch(PDO::FETCH_ASSOC);
            $query = $db->prepare("DELETE FROM photos WHERE id = :photo");
            $query->execute(array(':photo' => $id));
            if (file_exists("upload/userimage/" . $photo['name']))
                unlink("upload/userimage/" . $photo['name']);
            return '1';
        } else {
            return '0';
        }
    }
    public function makemain($user, $id)
    {
        $db = Db::getInstance();
        $query = $db->prepare("SELECT id FROM users WHERE email = :user");
        $query->execute(array(':user' => $user));
        $user = $query->fetch(PDO::FETCH_ASSOC);
        $query = $db->prepare("SELECT name FROM photos WHERE id = :photo");
        $query->execute(array(':photo' => $id));
        $photo = $query->fetch(PDO::FETCH_ASSOC);
        $query = $db->prepare("UPDATE users SET userpic = :pic WHERE id = :id");
        $query->execute(array(':pic' => $photo['name'], ':id' => $user['id']));
        return 1;
    }
}
?>