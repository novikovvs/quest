<?php

namespace App\Tasks\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Question;
use App\Models\Task;
use App\Tasks\Factories\CurrentTaskFactory;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class TasksController extends BaseController
{
    public function getCurrentTask(CurrentTaskFactory $factory): JsonResponse
    {
        $user = Auth::user();
        $dto = $factory->fromUser($user);
        return $this->success($dto);
    }
}
