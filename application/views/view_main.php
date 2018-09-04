<?php
    $num = file_get_contents("num.txt");
    $num++;
    file_put_contents("num.txt", $num);
?>
<div class="container" onload="load_start()">
    <main class="content" style="width: 100%">
        <div id="load_data"></div>
        <div id="load_data_message"></div>

    </main>

</div>
<script type="text/javascript" src="/js/main.js?v=1.0.<?php echo $num ?>"></script>