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
    Schema::create('notifications', function (Blueprint $table) {
        $table->id();  // Primary Key (ID)
        $table->text('message');  // Message column
        $table->string('status');  // Status column (like 'read', 'unread', etc.)
        $table->timestamps();  // This creates 'created_at' and 'updated_at' automatically
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
