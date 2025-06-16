<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        return Notification::all();
    }

    public function show($id)
    {
        return Notification::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string',
            'status' => 'required|string',
            // add other fields if needed
        ]);

        $notification = Notification::create($validated);

        return response()->json($notification, 201);
    }

    public function update(Request $request, $id)
    {
        $notification = Notification::findOrFail($id);

        $validated = $request->validate([
            'message' => 'sometimes|string',
            'status' => 'sometimes|string',
        ]);

        $notification->update($validated);

        return response()->json($notification, 200);
    }

    public function destroy($id)
    {
        Notification::destroy($id);
        return response()->json(null, 204);
    }
}
