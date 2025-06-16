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
    Schema::table('users', function (Blueprint $table) {
        $table->unsignedBigInteger('notification_id')->nullable()->after('password');
        $table->unsignedBigInteger('action_item_id')->nullable()->after('notification_id');
        $table->unsignedBigInteger('room_id')->nullable()->after('action_item_id');
        $table->unsignedBigInteger('booking_id')->nullable()->after('room_id');
        $table->string('role')->default('user')->after('booking_id');
        $table->string('profile_picture')->nullable()->after('role');

        // Add foreign key constraints
        $table->foreign('notification_id')->references('id')->on('notifications')->onDelete('set null');
        $table->foreign('action_item_id')->references('id')->on('action_items')->onDelete('set null');
        $table->foreign('room_id')->references('id')->on('rooms')->onDelete('set null');
        $table->foreign('booking_id')->references('id')->on('bookings')->onDelete('set null');
    });
}


    /**
     * Reverse the migrations.
     */
    public function down()
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropForeign(['notification_id']);
        $table->dropForeign(['action_item_id']);
        $table->dropForeign(['room_id']);
        $table->dropForeign(['booking_id']);
        
        $table->dropColumn(['notification_id', 'action_item_id', 'room_id', 'booking_id', 'role', 'profile_picture']);
    });
}

};
