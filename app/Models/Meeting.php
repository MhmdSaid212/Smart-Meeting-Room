<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Meeting extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'agenda'
        // add other fillable fields here
    ];
    public function attendees()
{
    return $this->belongsToMany(User::class, 'attendees', 'meeting_id', 'user_id')
                ->withTimestamps();
}

}
