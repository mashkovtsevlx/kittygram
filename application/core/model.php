<?php
    class Model
    {
        public function getUserById($id)
        {
            $db = Db::getInstance();
            $query = $db->prepare('SELECT email, activation, status, username, userpic, notifications FROM users WHERE id = :id');
            $query->execute(array(':id' => $id));
            $result = $query->fetch(PDO::FETCH_ASSOC);
            return ($result);
        }
        public function getUserByPhotoId($id)
        {
            $db = Db::getInstance();
            $query = $db->prepare('SELECT user_id FROM photos WHERE id = :id');
            $query->execute(array(':id' => $id));
            $user = $query->fetch(PDO::FETCH_ASSOC);
            $result = $this->getUserById($user['user_id']);
            return($result);
        }
        public function user_info($email)
        {
            $db = Db::getInstance();
            $query = $db->prepare("SELECT email, username, userpic, notifications FROM users WHERE email = :email");
            $query->execute(array(':email' => $email));
            if ($query->rowCount() > 0)
            {
                $result = $query->fetch(PDO::FETCH_ASSOC);
                return $result;
            }
        }
    }
?>
