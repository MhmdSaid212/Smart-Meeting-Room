<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ActionItemController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\AttachmentController;
use App\Http\Controllers\MinutesOfMeetingController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\MeetingController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\AttendeeController;

Route::apiResource('attendees', AttendeeController::class);


Route::apiResource('bookings', BookingController::class);


Route::apiResource('meetings', MeetingController::class);


Route::apiResource('rooms', RoomController::class);


Route::apiResource('minutes-of-meeting', MinutesOfMeetingController::class);


Route::apiResource('attachments', AttachmentController::class);


Route::apiResource('action-items', ActionItemController::class);


Route::apiResource('users', UserController::class);
Route::apiResource('notifications', NotificationController::class);

