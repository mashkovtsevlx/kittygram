<?php
    $menu = array();
    if(isset($_SESSION['session_username'])) {
        $menu[] = '<a class="menu__links-item" href="/capture">Make a photo</a>';
        $menu[] = '<a class="menu__links-item" onclick="$(\'.modal-settings\').toggleModal()">Settings</a>';
        $menu[] = '<a class="menu__links-item" onclick="logout()">Log Out</a>';
    }
    else
    {
        $menu[] = '<a class="menu__links-item" onclick="$(\'.modal-login\').toggleModal();">LogIn</a>';
    }
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<title></title>
	<meta name="keywords" content="" />
    <meta name="description" content="" />
    <meta name='viewport' content='width=device-width, initial-scale=1.0, user-scalable=0' >
<?php
    $num = file_get_contents("num.txt");
    $num++;
    file_put_contents("num.txt", $num);
?>
    <link href="/css/style.css?v=1.0.<?php echo $num ?>" rel="stylesheet">
    <link href="/css/responsive.css?v=1.0.<?php echo $num ?>" rel="stylesheet">
    <link rel="apple-touch-icon-precomposed" sizes="76x76" href="/images/ico/apple-icon-76x76.png">
    <link rel="apple-touch-icon-precomposed" sizes="120x120" href="/images/ico/apple-icon-120x120.png">
    <link rel="apple-touch-icon-precomposed" sizes="152x152" href="/images/ico/apple-icon-152x152.png">
    <link rel="apple-touch-icon-precomposed" sizes="167x167" href="/images/ico/apple-icon-167x167.png">
    <link rel="apple-touch-icon-precomposed" sizes="180x180" href="/images/ico/apple-icon-180x180.png">
    <link rel="icon" sizes="192x192" href="/images/ico/favicon-192.png">
    <link rel="mask-icon" href="/images/ico/favicon.svg" color="#262626">
    <link rel="shortcut icon" type="image/x-icon" href="/images/ico/favicon.ico">
</head>
<body>
<script type="text/javascript" src="/js/qjerry.js?v=1.0.<?php echo $num ?>"></script>
<div id="modal" class="hidden">
    <div class="modal-opt modal-login hidden">
        <div class="modal-header">
            <h5>Log In</h5>
            <button type="button" class="close" onclick="$('.modal-login').toggleModal()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-content">
            <form class="form-login">
                <div class="form-group">
                    <label>Email</label>
                    <input type="text" name="email" />
                </div>
                <div class="form-group">
                    <label>Password </label>
                    <input type="password" name="password" />
                </div>
                <div class="form-group" style="margin-bottom: 0">
                    <button type="button" class="btn btn-primary" onclick="login()">LogIn</button>
                    <button type="button" style="float: right" class="btn btn-optional" onclick="$('.modal-login').toggleModal('.modal-signup')">SignUp ></button>
                    <br /><br /><a onclick="$('.modal-login').toggleModal('.modal-forgot')"><small>Forgot password</small></a>
                </div>
            </form>
        </div>
        <div class="modal-footer">
        </div>
    </div>
    <div class="modal-opt modal-signup hidden">
        <div class="modal-header">
            <h5>Sign Up</h5>
            <button type="button" class="close" onclick="$('.modal-signup').toggleModal()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-content">
            <form class="form-signup">
                <div class="form-group">
                    <label>Email</label>
                    <input type="text" name="email" autocomplete="off" />
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" name="password" autocomplete="off" />
                </div>
                <div class="form-group">
                    <label>Repeat Password</label>
                    <input type="password" name="re_password" autocomplete="off" />
                </div>
                <div class="form-group">
                    <button type="button" class="btn btn-primary" onclick="signup()">Sign Up</button>
                    <button type="button" style="float: right" class="btn btn-optional" onclick="$('.modal-signup').toggleModal('.modal-login')">Login ></button>
                </div>
            </form>
        </div>
        <div class="modal-footer">
        </div>
    </div>
    <div class="modal-opt modal-forgot hidden">
        <div class="modal-header">
            <h5>Forgot Password</h5>
            <button type="button" class="close" onclick="$('.modal-signup').toggleModal()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-content">
            <form class="form-forgot">
                <div class="form-group">
                    <label>Email</label>
                    <input type="text" name="email" autocomplete="off" />
                </div>
                <div class="form-group">
                    <label>New Password</label>
                    <input type="password" name="password" autocomplete="off" />
                </div>
                <div class="form-group">
                    <label>Repeat New Password</label>
                    <input type="password" name="re_password" autocomplete="off" />
                </div>
                <div class="form-group">
                    <button type="button" class="btn btn-primary" onclick="forgot()">Send me reinitalize e-mail</button><br /><br /><br /><br />
                    <button type="button" style="" class="btn btn-optional" onclick="$('.modal-forgot').toggleModal('.modal-login')">Login ></button>
                    <button type="button" style="float: right" class="btn btn-optional" onclick="$('.modal-forgot').toggleModal('.modal-signup')">Sign Up ></button>
                </div>
            </form>
        </div>
        <div class="modal-footer">
        </div>
    </div>
    <div class="modal-opt modal-settings hidden">
        <div class="modal-header">
            <h5>Change settings</h5>
            <button type="button" class="close" onclick="$('.modal-settings').toggleModal()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-content">
            <form class="form-settings">
                <div class="form-group">
                    <label>Username</label>
                    <input type="text" name="username" value="<?php if (isset($page)) {echo $page['username'];} ?>" />
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="text" name="email" value="<?php if (isset($page)) {echo $page['email'];} ?>" />
                </div>
                <div class="form-group">
                    <label>Old Password</label>
                    <input type="password" name="password" />
                </div>
                <div class="form-group">
                    <label>New Password</label>
                    <input type="password" name="new_password" />
                </div>
                <div class="form-group">
                    <label>Repeat new password</label>
                    <input type="password" name="re_password" />
                </div>
                <div class="form-group">
                    <label style="margin-left: 5px">Send me notifications</label>
                    <input type="checkbox" name="notifications" style="width: auto; float: left;" <?php if (isset($page) && isset($page['notifications']) && $page['notifications'] === '1') {echo ('checked="checked"');} ?> />
                </div>
                <div class="form-group">
                    <button type="button" class="btn btn-primary" onclick="settings()">Save</button>
                </div>
            </form>
        </div>
        <div class="modal-footer">
        </div>
    </div>
</div>
<div class="wrapper">
	<header class="header">
        <div class="menu">
            <div class="header_stack">
                <a href="/"><img class="logo" src="/images/logo_text.png" alt="logo" /></a>
                <div class="menu__icon" onclick="$('.menu').toggleClass('menu_state_open');"></div>
                <div class="menu__links">
                    <?php 
                    foreach($menu as $val) {echo $val;} ?>
                </div>
            </div>
        </div>
	</header><!-- .header-->
	<div class="middle">
        <?php include 'application/views/'.$content_view; ?>
    </div><!-- .middle-->
</div><!-- .wrapper -->
<footer class="footer">
    <button class="core_menu"><a href="/"><img src="/images/ico/home.png" alt="Home" title="Home" /></a></button>
<?php
    if ($content_view != "view_capture.php")
    {
        if (isset($_SESSION) && isset($_SESSION["session_username"]))
        {
?>
    <button class="core_menu"><a href="/capture"><img src="/images/ico/instagram.png" alt="Make a photo" title="Make a photo" /></a></button>
<?php
        }
    }
    else
    {
?>
    <button class="core_menu take_shoot"><img src="/images/ico/capture.png" alt="Capture" title="Capture" /></button>
    <button class="core_menu add_effect"><img src="/images/ico/add.png" alt="Effects" title="Effects" /></button>
<?php
    }
?>
    <button class="core_menu user_profile"><img src="/images/ico/user.png" alt="User" title="User" /></button>
</footer><!-- .footer -->
<div class="modal-background hidden"></div>
<script type="text/javascript" src="/js/core.js?v=1.0.<?php echo $num ?>"></script>
<?php
    if ($content_view == "view_capture.php")
    {
?>
<script type="text/javascript" src="/js/capture.js?v=1.0.<?php echo $num ?>"></script>
<?php
    }
?>
</body>
</html>