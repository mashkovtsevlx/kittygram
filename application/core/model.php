<?php



    class Model

    {

        public function get_data()

        {

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

