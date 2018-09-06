<?php
class Controller_Capture extends Controller
{
    function __construct()
    {
        $this->model = new Model_Capture();
        $this->view = new View();
    }

    function action_index()
    {
        if (session_id() == "") {
            start_session();
        }
        if (isset($_SESSION["session_username"])) {
            $page = $this->model->user_info($_SESSION["session_username"]);
            $page['media'] = $this->model->getmedia($_SESSION["session_username"]);
            $this->view->generate('view_capture.php', 'view_template.php', $page);
        } else {
            header('Location: /');
        }
    }

    function action_getmedia()
    {
        if (isset($_SESSION["session_username"])) {
            $res = $this->model->getmedia($_SESSION["session_username"]);
            echo json_encode($res);
        }
    }

    function action_save()
    {
        $msg = 'fuck0';
        if (isset($_POST) && isset($_POST['src']) && isset($_SESSION["session_username"])) {
            $data = explode(',', $_POST['src']);
            $page = $this->model->user_info($_SESSION["session_username"]);
            if (isset($page['username']) && $page['username'] != "")
                $username = $page['username'];
            else
                $username = $page['email'];
            if (isset($page['userpic']) && $page['userpic'] != "")
                $userpic = $page['userpic'];
            else
                $userpic = "userpic.png";
            $newdata = str_replace(' ', '+', $data[1]);
            file_put_contents("test.txt", $newdata);
            if (isset($data[2]))
                file_put_contents("test2.txt", $data[2]);
            if (isset($_POST['facingmode']))
                $facingmode = $_POST['facingmode'];
            else
                $facingmode = null;
            if (isset($_POST['mask']) && isset($_POST['maskheight']))
                $msg = $this->model->save($newdata, $_SESSION["session_username"], $_POST['mask'], $_POST['maskheight'], $facingmode);
            else
                $msg = $this->model->save($newdata, $_SESSION["session_username"], null, null, $facingmode);
            $result = array();
            $result['username'] = $username;
            $result['userpic'] = $userpic;
            $result['name'] = $msg;
        }
        echo json_encode($result);
    }


    function action_comment()
    {
        if (isset($_SESSION["session_username"]) && isset($_POST) && isset($_POST['id']) && isset($_POST['comment']) && $_POST['comment'] != "") {
            $user = $this->model->comment($_SESSION["session_username"], $_POST['id'], $_POST['comment']);
            if (isset($user) && $user != "")
                echo $user;
            else
                echo $_SESSION["session_username"];
        }
    }
    
    function action_like()
    {
        if (isset($_SESSION["session_username"]) && isset($_POST) && isset($_POST['id'])) {
            $like = $this->model->like($_SESSION["session_username"], $_POST['id']);
            echo $like;
        } else {
            echo '0';
        }
    }

    function action_makemain()
    {
        if (isset($_SESSION["session_username"]) && isset($_POST) && isset($_POST['id'])) {
            $flag = $this->model->makemain($_SESSION["session_username"], $_POST['id']);
            echo $flag;
        } else {
            echo '0';
        }
    }

}
?>