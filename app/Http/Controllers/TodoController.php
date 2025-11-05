<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Todo;
use App\Models\Comment;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TodoController extends Controller
{
    public function index()
    {
        $todos = Todo::with('user', 'comments.user')->latest()->get();
        return Inertia::render('Todos/Index', [
            'todos' => $todos,
            'auth' => Auth::user(),
        ]);
    }

    public function store(Request $request)
    {
        $todo = Todo::create([
            'title' => $request->title,
            'description' => $request->description,
            'user_id' => Auth::id(),
        ]);

        return response()->json($todo);
    }

    public function update(Request $request, $id)
    {
        $todo = Todo::findOrFail($id);
        if ($todo->user_id != Auth::id()) return abort(403);

        $todo->update($request->only('title', 'description'));
        return response()->json($todo);
    }

    public function destroy($id)
    {
        $todo = Todo::findOrFail($id);
        if ($todo->user_id != Auth::id()) return abort(403);

        $todo->delete();
        return response()->json(['success' => true]);
    }

    public function check($id)
    {
        $todo = Todo::findOrFail($id);
        $todo->update([
            'is_done' => !$todo->is_done,
            'checked_by' => Auth::id(),
            'checked_at' => now(),
        ]);
        return response()->json($todo);
    }
}
