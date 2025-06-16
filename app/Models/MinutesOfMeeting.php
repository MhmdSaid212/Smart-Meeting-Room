<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MinutesOfMeeting extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $table = 'minutes_of_meetings';

    protected $fillable = [
        'action_item_id',
        'attachment_id',
        'summary',
    ];
}
