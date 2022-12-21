<!doctype html>
<?php
use App\JsGame\ResourceModels\JsScriptResourceModel
?>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" href=" {{asset('css/TagsGame.css')}}">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <?php /** @var JsScriptResourceModel $script */ ?>

</head>
<body>
@yield('body')
@foreach($scripts as $script)
    <script lang="js" src="{{asset("js/$script->scriptPath")}}"></script>
@endforeach
</body>
</html>
