<?php
    $dbg = Db::getInstance();
    function getUserById($id)
    {
        $query = $dbg->prepare('SELECT email, activation, status, username, userpic, notifications FROM users WHERE id = :id');
        $query->execute(array(':id' => $id));
        $result = $query->fetch(PDO::FETCH_ASSOC);
        return ($result);
    }

    function getUserByPhotoId($id)
    {
        $query = $dbg->prepare('SELECT user_id FROM photos WHERE id = :id');
        $query->execute(array(':id' => $id));
        $user = $query->fetch(PDO::FETCH_ASSOC);
        $result = getUserById($user['user_id']);
        return($result);
    }
?>