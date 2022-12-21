<?php

namespace App\Tasks\Factories;

use App\Tasks\DTOs\CurrentTaskDTO;
use Illuminate\Contracts\Auth\Authenticatable;

class CurrentTaskFactory
{
    public function fromUser(Authenticatable $user): CurrentTaskDTO
    {
        $dto = new CurrentTaskDTO();
        $task = $user->task ?? null;
        $dto->currentTaskId = $task->id;
        $dto->entityType = $task->entity_type;
        $dto->entity = $task->entity;
        return $dto;
    }
}
