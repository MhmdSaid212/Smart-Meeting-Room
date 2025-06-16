<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index()
    {
        return Room::all();
    }

    public function show($id)
    {
        return Room::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'booking_id' => 'nullable|exists:bookings,id',
            'meeting_id' => 'nullable|exists:meetings,id',
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'capacity' => 'required|integer',
            'features' => 'nullable|string',
        ]);

        $room = Room::create($validated);

        return response()->json($room, 201);
    }

    public function update(Request $request, $id)
    {
        $room = Room::findOrFail($id);

        $validated = $request->validate([
            'booking_id' => 'nullable|exists:bookings,id',
            'meeting_id' => 'nullable|exists:meetings,id',
            'name' => 'sometimes|string|max:255',
            'location' => 'sometimes|string|max:255',
            'capacity' => 'sometimes|integer',
            'features' => 'nullable|string',
        ]);

        $room->update($validated);

        return response()->json($room, 200);
    }

    public function destroy($id)
    {
        Room::destroy($id);
        return response()->json(null, 204);
    }
}
