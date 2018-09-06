<?php

class Controller_User extends Controller
{

	function __construct()
	{
        $this->model = new Model_User();
        $this->view = new View();
    }
    
    function action_login()
    {
        $msg = '<span class="badge badge-danger">Wrong credentials. Please, try again</span>';
        if(isset($_SESSION["session_username"])){
            $msg = '12345';
        }
        else if(isset($_POST["email"])){
            if(!empty($_POST['email']) && !empty($_POST['password'])) {
                $email=htmlspecialchars($_POST['email']);
                $password=hash('whirlpool', $_POST['password']);
                $msg = $this->model->login($email, $password);
            }
        }
        echo $msg;
    }

	function action_logout()
	{
		session_start();
		session_destroy();
    }
    

	function action_signup()
	{
		$msg = '<span class="badge badge-danger">Please, check your credentials and try again<span>';
		if (!empty($_POST['email']) && isset($_POST['email']) && !empty($_POST['password']) && isset($_POST['password']) && !empty($_POST['re_password']) && isset($_POST['re_password']) && $_POST['re_password'] === $_POST['password'])
		{
			$email=$_POST['email'];
            $password=$_POST['password'];
            if(strlen($password) < 8)
                $msg = '<span class="badge badge-danger">Password must consist at least of 8 chars</span>';
            else
            {
                $mail_regex = '/^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/';
                if(preg_match($mail_regex, $email))
                { 
                    $password=hash('whirlpool', $password);
                    $activation=hash('whirlpool', $email.time());
                    $msg = $this->model->signup($email, $password, $activation);
                }
            }
		}
		echo $msg;
    }

    function action_forgot()
	{
		$msg = '<span class="badge badge-danger">Please, check your credentials and try again<span>';
		if (!empty($_POST['email']) && isset($_POST['email']) && !empty($_POST['password']) && isset($_POST['password']) && !empty($_POST['re_password']) && isset($_POST['re_password']) && $_POST['re_password'] === $_POST['password'])
		{
			$email=$_POST['email'];
            $password=$_POST['password'];
            if(strlen($password) < 8)
                $msg = '<span class="badge badge-danger">Password must consist at least of 8 chars</span>';
            else
            {
                $mail_regex = '/^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/';
                $password=hash('whirlpool', $password);
                $activation=hash('whirlpool', $email.time());
                $msg = $this->model->forgot($email, $password, $activation);
            }
		}
		echo $msg;
    }

    function action_activation_forgot() {
        if(!empty($_GET['code']) && isset($_GET['code']))
        {
            $code = $_GET['code'];
            $msg = $this->model->activation_forgot($code);
            $this->view->generate('view_user.php', 'view_template.php', $msg);
        }
        else
        {
            Route::ErrorPage404();
        }
    }
    
    function action_activation()
    {
        if(!empty($_GET['code']) && isset($_GET['code']))
        {
            $code = $_GET['code'];
            $msg = $this->model->activation($code);
            $this->view->generate('view_user.php', 'view_template.php', $msg);
        }
        else
        {
            Route::ErrorPage404();
        }
    }

    function action_settings()
	{
        $msg = '<span class="badge badge-danger">Please, check your credentials and try again<span>';
        if (!isset($_SESSION["session_username"]))
            $msg = "fuck";
		if (isset($_POST['notifications']) && !empty($_POST['email']) && isset($_POST['email']) && !empty($_POST['new_password']) && isset($_POST['new_password']) && !empty($_POST['password']) && isset($_POST['password']) && !empty($_POST['re_password']) && isset($_POST['re_password']) && $_POST['re_password'] === $_POST['new_password'] && !empty($_POST['username']) && isset($_POST['username']) && isset($_SESSION["session_username"]))
		{
			$email = $_POST['email'];
            $password = $_POST['password'];
            $username = $_POST['username'];
            $oldemail = $_SESSION["session_username"];
            $new_password = $_POST['new_password'];
            $notifications = $_POST['notifications'];
            $activation=hash('whirlpool', $email.time());
			$mail_regex = '/^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/';
			if(preg_match($mail_regex, $email))
			{ 
                $password=hash('whirlpool', $password);
                $new_password=hash('whirlpool', $new_password);
                $msg = $this->model->settings($email, $password, $new_password, $username, $oldemail, $activation, $notifications);
			}
		}
		echo $msg;
    }

    function action_loggedin()
    {
        if (isset($_SESSION["session_username"]))
        {
            echo '1';
        }
        else
        {
            echo '0';
        }
    }
}
