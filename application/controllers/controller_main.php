<?php
class Controller_Main extends Controller
{
	function __construct()
	{
		$this->model = new Model_Main();
		$this->view = new View();
	}
	function action_index()
	{
		if(session_id() == "") 
		{ 
			start_session(); 
		} 
		if (isset($_SESSION["session_username"]) && !empty($_SESSION["session_username"]))
		{
			$page = $this->model->user_info($_SESSION["session_username"]);
			$this->view->generate('view_main.php', 'view_template.php', $page);
		}
		else
			$this->view->generate('view_main.php', 'view_template.php');
	}
	function action_loaddata()
	{
		if(session_id() == "") 
		{ 
			start_session(); 
		}
		if (isset($_POST['limit']) && isset($_POST['start']))
		{
			if (isset($_SESSION["session_username"]) && !empty($_SESSION["session_username"]) && isset($_POST['limit']) && isset($_POST['start']))
			{
				$this->model->loaddata($_SESSION["session_username"], $_POST['limit'], $_POST['start']);
			}
			else
				$this->model->loaddata(null, $_POST['limit'], $_POST['start']);
		}
		else {
			echo 'error';
		}
	}
}