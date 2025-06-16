<?php

namespace App\Http\Controllers;

use App\Models\ActionItem;
use Illuminate\Http\Request;

class ActionItemController extends Controller
{
    public function index()
    {
        return ActionItem::all();
    }

    public function show($id)
    {
        return ActionItem::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'due_date' => 'required|date',
            'status' => 'required|string',
            'description' => 'required|string',
        ]);

        $actionItem = ActionItem::create($validated);

        return response()->json($actionItem, 201);
    }

    public function update(Request $request, $id)
    {
        $actionItem = ActionItem::findOrFail($id);

        $validated = $request->validate([
            'due_date' => 'sometimes|date',
            'status' => 'sometimes|string',
            'description' => 'sometimes|string',
        ]);

        $actionItem->update($validated);

        return response()->json($actionItem, 200);
    }

    public function destroy($id)
    {
        ActionItem::destroy($id);
        return response()->json(null, 204);
    }
}
