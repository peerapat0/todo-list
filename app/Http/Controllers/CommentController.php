<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class CommentController extends Controller
{
public function store(Request $request)
{
    $validated = $request->validate([
        'todo_id' => 'required|exists:todos,id',
        'content' => 'nullable|string',
        'image' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
    ], [
        'image.mimes' => 'ไฟล์ต้องเป็นรูปภาพประเภท JPG หรือ PNG เท่านั้น',
        'image.max' => 'ขนาดไฟล์ต้องไม่เกิน 2MB',
    ]);

    $path = null;

    if ($request->hasFile('image')) {
        $path = $request->file('image')->store('comments', 'public');
    }

    $comment = \App\Models\Comment::create([
        'todo_id' => $validated['todo_id'],
        'user_id' => auth()->id(),
        'content' => $validated['content'] ?? null,
        'image' => $path,
    ]);

    return response()->json([
        'success' => true,
        'comment' => $comment,
    ]);
}


    public function destroy($id)
    {
        $comment = Comment::findOrFail($id);

        if ($comment->user_id !== Auth::id()) {
            return abort(403, 'ไม่อนุญาตให้ลบความคิดเห็นของผู้อื่น');
        }

        if ($comment->image) {
            Storage::disk('public')->delete($comment->image);
        }

        $comment->delete();

        return response()->json(['success' => true]);
    }
}
