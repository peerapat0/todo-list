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
       
        $todos = Todo::with(['user', 'comments.user', 'checkedUser'])
            ->latest()
            ->get();

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

        if ($todo->is_done) {
            // ถ้ายกเลิก
            $todo->is_done = false;
            $todo->checked_by = null;
            $todo->checked_at = null;
        } else {
            // ถ้าทำเสร็จ
            $todo->is_done = true;
            $todo->checked_by = Auth::id();
            $todo->checked_at = now();
        }

        $todo->save();

        return response()->json(['success' => true]);
    }
}
