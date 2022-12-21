<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BaseController extends Controller
{
    public function success(mixed $data = null, string $message = ''): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'result' => $data,
            'message' => $message,
        ]);
    }

    public function fail()
    {

    }
}
