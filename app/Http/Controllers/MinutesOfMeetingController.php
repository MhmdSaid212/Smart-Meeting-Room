<?php

namespace App\Http\Controllers;

use App\Models\MinutesOfMeeting;
use Illuminate\Http\Request;

class MinutesOfMeetingController extends Controller
{
    public function index()
    {
        return MinutesOfMeeting::all();
    }

    public function show($id)
    {
        return MinutesOfMeeting::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'action_item_id' => 'required|exists:action_items,id',
            'attachment_id' => 'nullable|exists:attachments,id',
            'summary' => 'required|string|max:255',
        ]);

        $mom = MinutesOfMeeting::create($validated);

        return response()->json($mom, 201);
    }

    public function update(Request $request, $id)
    {
        $mom = MinutesOfMeeting::findOrFail($id);

        $validated = $request->validate([
            'action_item_id' => 'sometimes|exists:action_items,id',
            'attachment_id' => 'nullable|exists:attachments,id',
            'summary' => 'sometimes|string',
        ]);

        $mom->update($validated);

        return response()->json($mom, 200);
    }

    public function destroy($id)
    {
        MinutesOfMeeting::destroy($id);
        return response()->json(null, 204);
    }
}
