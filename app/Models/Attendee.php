<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendee extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'meeting_id',
    ];

    public $timestamps = false; // If your pivot table has no timestamps
}
