<?php

class Controller_Test extends Controller

{

    function __construct()
	{
        $this->model = new Model_Test();
        $this->view = new View();
    }

    function action_index()
	{
        $this->view->generate('view_test.php', 'view_template.php');
    }
}