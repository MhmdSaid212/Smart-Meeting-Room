<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index()
    {
        return Booking::all();
    }

    public function show($id)
    {
        return Booking::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'status' => 'nullable|string',
            // add other booking fields here if any
        ]);

        $booking = Booking::create($validated);
        return response()->json($booking, 201);
    }

    public function update(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        $validated = $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'meeting_id' => 'sometimes|exists:meetings,id',
            'room_id' => 'sometimes|exists:rooms,id',
            'start_time' => 'sometimes|date',
            'end_time' => 'sometimes|date|after:start_time',
            'status' => 'nullable|string',
            // add other booking fields here if any
        ]);

        $booking->update($validated);
        return response()->json($booking, 200);
    }

    public function destroy($id)
    {
        Booking::destroy($id);
        return response()->json(null, 204);
    }
}
