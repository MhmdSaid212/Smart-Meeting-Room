<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use Illuminate\Http\Request;

class MeetingController extends Controller
{
    public function index()
    {
        return Meeting::all();
    }

    public function show($id)
    {
        return Meeting::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'agenda' => 'required|string|max:255'
            // add other fields relevant to your Meeting table here
        ]);

        $meeting = Meeting::create($validated);
        return response()->json($meeting, 201);
    }

    public function update(Request $request, $id)
    {
        $meeting = Meeting::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'agenda' => 'sometimes|string|max:255',
            // add other fields relevant to your Meeting table here
        ]);

        $meeting->update($validated);
        return response()->json($meeting, 200);
    }

    public function destroy($id)
    {
        Meeting::destroy($id);
        return response()->json(null, 204);
    }
}
