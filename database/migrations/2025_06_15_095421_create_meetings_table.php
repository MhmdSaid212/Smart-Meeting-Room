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
    Schema::create('meetings', function (Blueprint $table) {
        $table->id(); // Primary Key
        $table->string('title'); // Meeting Title
        $table->text('agenda');  // Meeting Agenda
        $table->timestamps();    // created_at and updated_at
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meetings');
    }
};
