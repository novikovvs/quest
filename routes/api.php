<?php

use App\Tasks\Controllers\TasksController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::controller(AuthController::class)->group(function () {
    Route::post('login', 'login');
    Route::post('register', 'register');
    Route::post('logout', 'logout');
    Route::post('refresh', 'refresh');

});

Route::middleware('auth')->group(function () {
    Route::prefix('task')->controller(TasksController::class)->group(function () {
        Route::get('current', 'getCurrentTask');
        Route::post('save', 'save');
    });
});

