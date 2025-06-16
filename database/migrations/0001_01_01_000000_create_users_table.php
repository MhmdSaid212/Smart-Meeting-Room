<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('users', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('email')->unique();
        $table->timestamp('email_verified_at')->nullable();
        $table->string('password');

        // Your added foreign key columns (nullable)
        $table->unsignedBigInteger('notification_id')->nullable();
        $table->unsignedBigInteger('action_item_id')->nullable();
        $table->unsignedBigInteger('room_id')->nullable();
        $table->unsignedBigInteger('booking_id')->nullable();

        $table->string('role')->default('user');
        $table->string('profile_picture')->nullable();

        $table->rememberToken();
        $table->timestamps();

        // Foreign key constraints
        $table->foreign('notification_id')->references('id')->on('notifications')->onDelete('set null');
        $table->foreign('action_item_id')->references('id')->on('action_items')->onDelete('set null');
        $table->foreign('room_id')->references('id')->on('rooms')->onDelete('set null');
        $table->foreign('booking_id')->references('id')->on('bookings')->onDelete('set null');
    });

    Schema::create('password_reset_tokens', function (Blueprint $table) {
        $table->string('email')->primary();
        $table->string('token');
        $table->timestamp('created_at')->nullable();
    });

    Schema::create('sessions', function (Blueprint $table) {
        $table->string('id')->primary();
        $table->foreignId('user_id')->nullable()->index();
        $table->string('ip_address', 45)->nullable();
        $table->text('user_agent')->nullable();
        $table->longText('payload');
        $table->integer('last_activity')->index();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
