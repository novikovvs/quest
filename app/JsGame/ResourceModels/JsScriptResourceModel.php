<?php

namespace App\JsGame\ResourceModels;

class JsScriptResourceModel
{
    public string $scriptPath;
    public function __construct(string $scriptPath)
    {
        $this->scriptPath = $scriptPath;
    }
}
