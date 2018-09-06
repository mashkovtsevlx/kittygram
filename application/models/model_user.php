<?php

class Model_User extends Model
{
    public $page;

    public function __construct($page = null)
    {
        $this->page = $page;
    }

    public function login($email, $password)
    {
        $db = Db::getInstance();
        $query = $db->prepare("SELECT * FROM users WHERE email = :email AND password = :password");
        $query->execute(array(':email' => $email, ':password' => $password));

        if ($query->rowCount() > 0)
        {
            $result = $query->fetch(PDO::FETCH_ASSOC);
            if ($result['status'] != 1)
                return '<span class="badge badge-danger">User not activated. Please, check your mail</span>';
            else
            {
                if(session_id() == '' || !isset($_SESSION)) {
                    session_start();
                }
                $_SESSION['session_username']=$email;
                return '1';
            }
        }
        else
            return '<span class="badge badge-danger">Login/Password combo not found. Please, try again</span>';
    }

    public function signup($email, $password, $activation)
    {
        $db = Db::getInstance();
        $emails_query = $db->prepare("SELECT id FROM users WHERE email = :email");
        $emails_query->execute(array(':email' => $email));
        if ($emails_query->rowCount() < 1)
        {
            $user_query = $db->prepare("INSERT INTO users(email,password,activation) VALUES(:email, :password, :activation)");
            $user_query->execute(array(':email' => $email, ':password' => $password, ':activation' => $activation));
            $to=$email;
            $subject="Email Confirmation";
            $body='Hi! <br/> <br/> Please, confirm your email using a link below <br/> <br/> <a href="kittygram.pp.ua/user/activation/?code='.$activation.'">kittygram.pp.ua/activation/?code='.$activation.'</a>';
            
            Send_Mail($to,$subject,$body);
            return '<span class="badge badge-success">Sucessfully signed up. Please, check your email</span>';  
        }
        return '<span class="badge badge-danger">This email is already registered</span>';
    }

    public function forgot($email, $password, $activation)
    {
        $db = Db::getInstance();
        $emails_query = $db->prepare("SELECT id FROM users WHERE email = :email");
        $emails_query->execute(array(':email' => $email));
        if ($emails_query->rowCount() > 0)
        {
            $user_query = $db->prepare("INSERT INTO forgot(email,password,activation) VALUES(:email, :password, :activation)");
            $user_query->execute(array(':email' => $email, ':password' => $password, ':activation' => $activation));
            $to=$email;
            $subject="Kittygram password change confirmation";
            $body='Hi! <br/> <br/>Please, confirm your password change using a link below <br/> <br/> <a href="kittygram.pp.ua/user/activation_forgot/?code='.$activation.'">kittygram.pp.ua/activation_forgot/?code='.$activation.'</a>';
            
            Send_Mail($to,$subject,$body);
            return '<span class="badge badge-success">Sucessfully sent a request. Check your email</span>';  
        }
        return '<span class="badge badge-danger">This user does not exist</span>';
    }

    public function activation_forgot($code)
    {
        $db = Db::getInstance();
        $codes_query = $db->prepare("SELECT email, password FROM forgot WHERE activation = :code");
        $codes_query->execute(array(':code' => $code));
        $user = $codes_query->fetch(PDO::FETCH_ASSOC);
        if ($codes_query->rowCount() > 0)
        {
            $user_query = $db->prepare("SELECT id FROM users WHERE email = :email");
            $user_query->execute(array(':email' => $user['email']));
            if ($user_query->rowCount() == 1)
            {
                $update_query = $db->prepare("UPDATE users SET password = :password WHERE email = :email");
                $update_query->execute(array(':password' => $user['password'], ':email' => $user['email']));
                $update_query = $db->prepare("DELETE FROM forgot WHERE activation = :code");
                $update_query->execute(array(':code' => $code));
                return "Your account password changed sucessfully. You may log in now";
            }
            else
            {
                return "This code is expired";
            }
        }
        return "Not valid activation code";
    }

    public function activation($code)
    {
        $db = Db::getInstance();
        $codes_query = $db->prepare("SELECT id FROM users WHERE activation = :code");
        $codes_query->execute(array(':code' => $code));
        if ($codes_query->rowCount() > 0)
        {
            $user_query = $db->prepare("SELECT id FROM users WHERE activation = :code and status='0'");
            $user_query->execute(array(':code' => $code));
            if ($codes_query->rowCount() == 1)
            {
                $update_query = $db->prepare("UPDATE users SET status='1' WHERE activation = :code");
                $update_query->execute(array(':code' => $code));
                return "Your account activated sucessfully. You may log in now";
            }
            else
            {
                return "This code is already activated";
            }
        }
        return "Not valid activation code";
    }
    public function settings($email, $password, $new_password, $username, $oldemail, $activation, $notifications)
    {
        $db = Db::getInstance();
        $status = 0;
        $query = $db->prepare("SELECT password, activation FROM users WHERE email = :oldemail");
        $query->execute(array(':oldemail' => $oldemail));
        if ($query->rowCount() > 0)
        {
            $result = $query->fetch(PDO::FETCH_ASSOC);
            if ($email === $oldemail)
                $status = 1;
            if ($password === $result['password'])
            {
                $query->execute(array(':oldemail' => $email));
                if ($query->rowCount() < 1 || $status == 1)
                {
                    $query = $db->prepare("UPDATE users SET email = :email, password = :new_password, username = :username, activation = :activation, status = :status, notifications = :notifications WHERE email = :oldemail");
                    $query->execute(array(':email' => $email, ':new_password' => $new_password, ':username' => $username, ':activation' => $activation, ':oldemail' => $oldemail, ':status' => $status, ':notifications' => $notifications));
                    if ($status == 0)
                    {
                        $to=$email;
                        $subject="Email Confirmation";
                        $body='Hi! <br/> <br/> Please, confirm your email using a link below <br/> <br/> <a href="http://kittygram.pp.ua/user/activation/?code='.$activation.'">kittygram.pp.ua/activation/?code='.$activation.'</a>';
                        
                        Send_Mail($to,$subject,$body);
                        return '<span class="badge badge-success page-reload">Settings updated. Please, check your email and relogin<br />Page reloads in 3</span>';  
                    }
                    else
                        return '<span class="badge badge-success">Settings saved</span>';
                    
                }
                else
                    return '<span class="badge badge-success">This email already registered</span>';
            }
            else
                return '<span class="badge badge-danger">Old pass wrong. Try again</span>';
        }
        return '<span class="badge badge-danger">User does not exist</span>';
    }
}

?>
