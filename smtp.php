<?php
    function Send_Mail($to,$subject,$body)
    {
        $header = "From:admin@inso.codes \r\n";
        $header .= "MIME-Version: 1.0\r\n";
        $header .= "Content-type: text/html\r\n";
        mail($to,$subject,$body,$header);
    }
?>