<?php
class Model_Test extends Model
{
    public $page;
    public function __construct($page = null)
    {
        $this->page = $page;
    }
}