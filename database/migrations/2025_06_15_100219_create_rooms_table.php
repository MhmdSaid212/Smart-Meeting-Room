<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('rooms', function (Blueprint $table) {
        $table->id(); // Primary Key

        // Foreign Keys
        $table->unsignedBigInteger('booking_id')->nullable();
        $table->unsignedBigInteger('meeting_id')->nullable();

        // Room Details
        $table->string('name');
        $table->string('location');
        $table->integer('capacity');
        $table->text('features')->nullable(); // e.g., projector, AC, etc.

        $table->timestamps();

        // Relationships
        $table->foreign('booking_id')->references('id')->on('bookings')->onDelete('set null');
        $table->foreign('meeting_id')->references('id')->on('meetings')->onDelete('set null');
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
