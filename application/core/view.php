<?php
    class View
    {        
        function generate($content_view, $template_view, $page = null)
        {            
            include 'application/views/'.$template_view;
        }
    }
?>
