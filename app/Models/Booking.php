<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'meeting_id',
        'room_id',
        'start_time',
        'end_time',
        'status',
        // add other fillable fields here
    ];
}
