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
    Schema::create('minutes_of_meetings', function (Blueprint $table) {
        $table->id(); // Primary Key

        // Foreign Keys
        $table->unsignedBigInteger('action_item_id');
        $table->unsignedBigInteger('attachment_id')->nullable(); // Optional attachment

        // Other fields
        $table->text('summary');
        $table->timestamp('created_at')->useCurrent(); // Set current timestamp

        // Relationships
        $table->foreign('action_item_id')->references('id')->on('action_items')->onDelete('cascade');
        $table->foreign('attachment_id')->references('id')->on('attachments')->onDelete('set null');
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('minutes_of_meetings');
    }
};
