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
    Schema::create('action_items', function (Blueprint $table) {
        $table->id(); // Primary key (ID)
        $table->date('due_date'); // DueDate
        $table->string('status'); // Status
        $table->text('description'); // Description
        $table->timestamps(); // Adds created_at and updated_at
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('action_items');
    }
};
