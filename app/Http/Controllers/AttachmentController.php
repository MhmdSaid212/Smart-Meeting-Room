<?php

namespace App\Http\Controllers;

use App\Models\Attachment;
use Illuminate\Http\Request;

class AttachmentController extends Controller
{
    public function index()
    {
        return Attachment::all();
    }

    public function show($id)
    {
        return Attachment::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'required|string|max:255'
        ]);

        $attachment = Attachment::create($validated);

        return response()->json($attachment, 201);
    }

    public function update(Request $request, $id)
    {
        $attachment = Attachment::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'url' => 'sometimes|string|max:255'
        ]);

        $attachment->update($validated);

        return response()->json($attachment, 200);
    }

    public function destroy($id)
    {
        Attachment::destroy($id);
        return response()->json(null, 204);
    }
}
