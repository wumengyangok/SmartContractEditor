<?php
    // $editor_data = $_POST[ 'editor1' ];
    $number_saved = $_POST['total'];
?>


<?= $number_saved ?>

<!-- <html>
<head>
  <meta charset="UTF-8">
  <title>Label texts</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css">
      <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <body ng-app="switches">
    <div class='container'>
      <div ng-controller="togglers" >
          <h2>Choose the Semantic Variations</h2>   
          <ng-switch-toggle-group ng-cloak group-name="multi" theme="dark blue" ng-model="multichoice" choices="choices"></ng-switch-toggle-group>
          value : {{multichoice}}
      </div>
    </div>
    </body>
    <p><b>Hello there!</b> You can highlight any text in the next two paragraphs. Text highlights are stored only using the search string and the offset relative to the parent. This data could be stored in a database and persistent across refreshes. No XPaths or complicated selectors are used.</p>

    <div class="parent"><?= $number_saved ?></div>

    <!-- <form id="sampleForm" name="sampleForm" method="post" action="save_v2.php">
      <input type="hidden" name="total" id="total" value="">
      <a href="#" onclick="saveValue();">Click to save</a>
    </form> -->

    <!--
    <script src='http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js'></script>
    <script src='https://ajax.googleapis.com/ajax/libs/angularjs/1.2.16/angular.js'></script>
    <script src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/131045/ngToggle.js'></script>
    <script src="../js/index.js"></script>
    <script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js'></script>
</body>
</html> -->