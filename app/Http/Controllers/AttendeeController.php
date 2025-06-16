<?php

namespace App\Http\Controllers;

use App\Models\Attendee;
use Illuminate\Http\Request;

class AttendeeController extends Controller
{
    public function index()
    {
        return Attendee::all();
    }

    public function show($id)
    {
        return Attendee::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'meeting_id' => 'required|exists:meetings,id',
        ]);

        $attendee = Attendee::create($validated);

        return response()->json($attendee, 201);
    }

    public function update(Request $request, $id)
    {
        $attendee = Attendee::findOrFail($id);

        $validated = $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'meeting_id' => 'sometimes|exists:meetings,id',
        ]);

        $attendee->update($validated);

        return response()->json($attendee, 200);
    }

    public function destroy($id)
    {
        Attendee::destroy($id);
        return response()->json(null, 204);
    }
}
