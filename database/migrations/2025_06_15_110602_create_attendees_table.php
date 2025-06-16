<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAttendeesTable extends Migration
{
    public function up(): void
    {
        Schema::create('attendees', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('meeting_id')->constrained('meetings')->onDelete('cascade');
            $table->primary(['user_id', 'meeting_id']); // composite primary key

            $table->timestamps(); // optional, if you want to track when the user was added to the meeting
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendees');
    }
}

