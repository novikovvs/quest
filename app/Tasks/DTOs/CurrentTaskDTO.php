<?php

namespace App\Tasks\DTOs;

use App\Models\Game;
use App\Models\Question;
use App\Models\Task;

class CurrentTaskDTO
{
    public int $currentTaskId;

    public string $entityType;

    public Question|Game $entity;

    public function __toArray(): array
    {
        return [
            "current_task_id" => $this->currentTaskId,
            "entity_type" => $this->entity,
            "entity" => $this->entity,
        ];
    }
}
