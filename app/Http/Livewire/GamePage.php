<?php

namespace App\Http\Livewire;

use Livewire\Component;

class GamePage extends Component
{
    public int $gameId;
    public function render()
    {
        return view('livewire.game-page');
    }
}
