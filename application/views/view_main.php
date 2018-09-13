<?php
    $num = file_get_contents("num.txt");
    $num++;
    file_put_contents("num.txt", $num);
?>
<div class="debugging-mobile" style="position: fixed; top: 0; left: 0; width: 100%; height: auto; background: white;
color: black;"></div>
<div class="container" onload="load_start()">
    <main class="content" style="width: 100%">
        <div id="load_data"></div>
        <div id="load_data_message"></div>
    </main>
</div>
<script type="text/javascript" src="/js/main.js?v=1.0.<?php echo $num ?>"></script>