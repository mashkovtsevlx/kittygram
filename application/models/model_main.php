<?php



class Model_Main extends Model

{

    public $page;



    public function __construct($page = null)

    {

        $this->page = $page;

    }

    public function loaddata($user, $limit, $start)
    {
        $db = Db::getInstance();
        $l = (int)$limit;
        $s = (int)$start;
        $query = $db->prepare("SELECT * FROM photos Limit ".$s.", ".$l);
        $query->execute();
        $result = array();
        if ($query->rowCount() > 0) {
            while ($photo = $query->fetch(PDO::FETCH_ASSOC))
            {
                $pic = array();
                $taken = $db->prepare("SELECT email, username, userpic FROM users WHERE id = :user_id");
                $taken->execute(array(':user_id' => $photo['user_id']));
                $taken = $taken->fetch(PDO::FETCH_ASSOC);
                $pic['username'] = $taken['username'] === '' ? $taken['username'] : $taken['email'];
                $pic['userpic'] = $taken['userpic'];
                $pic['name']['id'] = $photo['id'];
                $pic['name']['name'] = $photo['name'];
                $taken = $db->prepare("SELECT id FROM likes WHERE photo_id = :photo_id AND user_id = :user_id");
                $taken->execute(array('photo_id' => $photo['id'], ':user_id' => $photo['user_id']));
                if ($taken->rowCount() > 0) {
                    $pic['like'] = '/images/ico/like_red.png';
                }
                else
                {
                    $pic['like'] = '/images/ico/like.png';
                }
                $result[] = $pic;
            }
        }
        echo(json_encode($result));
    }


}



?>

