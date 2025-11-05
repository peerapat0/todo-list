import React, { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Index() {
    const { todos, auth } = usePage().props;
    const [newTodo, setNewTodo] = useState({ title: "", description: "" });
    const [editingId, setEditingId] = useState(null);
    const [editTodo, setEditTodo] = useState({ title: "", description: "" });
    const [commentInputs, setCommentInputs] = useState({});
    const [commentImages, setCommentImages] = useState({});

    // เพิ่ม Todo
    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newTodo.title.trim()) return alert("กรุณากรอกชื่อรายการ");
        await axios.post("/todos", newTodo);
        location.reload();
    };

    // แก้ไข Todo
    const handleUpdate = async (id) => {
        await axios.put(`/todos/${id}`, editTodo);
        setEditingId(null);
        location.reload();
    };

    // ลบ Todo
    const handleDelete = async (id) => {
        if (confirm("แน่ใจว่าจะลบรายการนี้?")) {
            await axios.delete(`/todos/${id}`);
            location.reload();
        }
    };

    // เช็กเสร็จ / ยกเลิก
    const handleCheck = async (id) => {
        await axios.patch(`/todos/${id}/check`);
        location.reload();
    };

    //  เพิ่มคอมเมนต์
    const handleAddComment = async (e, todoId) => {
    e.preventDefault();
    try {
        const formData = new FormData();
        formData.append("todo_id", todoId);
        formData.append("content", commentInputs[todoId] || "");
        if (commentImages[todoId])
            formData.append("image", commentImages[todoId]);

        await axios.post("/comments", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        setCommentInputs({ ...commentInputs, [todoId]: "" });
        setCommentImages({ ...commentImages, [todoId]: null });
        location.reload();
    } catch (error) {
        if (error.response?.status === 422) {
            alert(error.response.data.message || "❌ ไฟล์ไม่ถูกต้อง (ต้องเป็น JPG หรือ PNG เท่านั้น)");
        } else {
            alert("เกิดข้อผิดพลาดในการเพิ่มคอมเมนต์");
        }
    }
};
    //  ลบคอมเมนต์
    const handleDeleteComment = async (id) => {
        if (confirm("ต้องการลบความคิดเห็นนี้หรือไม่?")) {
            await axios.delete(`/comments/${id}`);
            location.reload();
        }
    };

    return (
        <div className="container py-4">
            <Head title="Todo List" />

            <div className="text-center mb-5">
                <h1 className="fw-bold text-primary mb-2">📋 Todo List</h1>
                <p className="text-muted">จัดการสิ่งที่ต้องทำของคุณได้ที่นี่</p>
            </div>

           
            <div className="card shadow-sm mb-4 border-0">
                <div className="card-body">
                    <form onSubmit={handleAdd}>
                        <div className="row g-2 align-items-center">
                            <div className="col-12 col-md-4">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="ชื่อรายการ..."
                                    value={newTodo.title}
                                    onChange={(e) =>
                                        setNewTodo({
                                            ...newTodo,
                                            title: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="col-12 col-md-5">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="รายละเอียด..."
                                    value={newTodo.description}
                                    onChange={(e) =>
                                        setNewTodo({
                                            ...newTodo,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="col-12 col-md-3 text-md-end mt-2 mt-md-0">
                                <button
                                    className="btn btn-primary w-100 w-md-auto fw-semibold"
                                    type="submit"
                                >
                                    ➕ เพิ่มรายการ
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <ul className="list-group shadow-sm">
                {todos.length === 0 ? (
                    <li className="list-group-item text-center py-4 text-muted">
                        ไม่มีรายการ 😅
                    </li>
                ) : (
                    todos.map((todo) => (
                        <li
                            key={todo.id}
                            className={`list-group-item p-3 ${
                                todo.is_done ? "list-group-item-success" : ""
                            }`}
                        >
                            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center">
                                <div className="flex-grow-1">
                                    {editingId === todo.id ? (
                                        <div className="mb-2">
                                            <input
                                                type="text"
                                                className="form-control mb-2"
                                                value={editTodo.title}
                                                onChange={(e) =>
                                                    setEditTodo({
                                                        ...editTodo,
                                                        title: e.target.value,
                                                    })
                                                }
                                            />
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editTodo.description}
                                                onChange={(e) =>
                                                    setEditTodo({
                                                        ...editTodo,
                                                        description:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            <h5
                                                className={`fw-bold mb-1 ${
                                                    todo.is_done
                                                        ? "text-decoration-line-through text-success"
                                                        : ""
                                                }`}
                                            >
                                                {todo.title}
                                            </h5>
                                            {todo.description && (
                                                <p className="text-muted mb-1 small">
                                                    {todo.description}
                                                </p>
                                            )}
                                            <span className="badge bg-light text-dark">
                                                🧑 {todo.user?.name ?? "ไม่ทราบผู้สร้าง"}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-3 mt-lg-0 d-flex flex-wrap gap-2">
                                    <button
                                        className={`btn btn-sm ${
                                            todo.is_done
                                                ? "btn-outline-secondary"
                                                : "btn-outline-success"
                                        }`}
                                        onClick={() => handleCheck(todo.id)}
                                    >
                                        {todo.is_done ? "↩️ ยกเลิก" : "✅ เสร็จแล้ว"}
                                    </button>

                                    {todo.user_id === auth.id && (
                                        <>
                                            {editingId === todo.id ? (
                                                <>
                                                    <button
                                                        className="btn btn-sm btn-primary"
                                                        onClick={() =>
                                                            handleUpdate(todo.id)
                                                        }
                                                    >
                                                        💾 บันทึก
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-secondary"
                                                        onClick={() =>
                                                            setEditingId(null)
                                                        }
                                                    >
                                                        ❌ ยกเลิก
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="btn btn-sm btn-warning text-white"
                                                        onClick={() => {
                                                            setEditingId(todo.id);
                                                            setEditTodo({
                                                                title: todo.title,
                                                                description:
                                                                    todo.description,
                                                            });
                                                        }}
                                                    >
                                                        ✏️ แก้ไข
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() =>
                                                            handleDelete(todo.id)
                                                        }
                                                    >
                                                        🗑️ ลบ
                                                    </button>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                           
                            <div className="mt-3 border-top pt-3 w-100">
                                <h6 className="fw-semibold mb-2">💬 Comments</h6>

                                {todo.comments.length === 0 && (
                                    <p className="text-muted small mb-2">
                                        ยังไม่มีคอมเมนต์
                                    </p>
                                )}

                                {todo.comments.map((cmt) => (
                                    <div
                                        key={cmt.id}
                                        className="border rounded p-2 mb-2 bg-light"
                                    >
                                        <strong>{cmt.user?.name}</strong>
                                        <p className="mb-1">{cmt.content}</p>
                                       {cmt.image && (
                                            <div className="mt-2 flex justify-center">
                                                <img
                                                    src={
                                                        cmt.image.startsWith("comments/")
                                                            ? `/storage/${cmt.image}`
                                                            : `/storage/comments/${cmt.image}`
                                                    }
                                                    alt="comment"
                                                    className="rounded-lg shadow-sm border border-gray-300"
                                                    style={{
                                                        width: "100%",
                                                        maxWidth: "200px",
                                                        height: "auto",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            </div>
                                        )}

                                        {cmt.user_id === auth.id && (
                                            <button
                                                className="btn btn-sm btn-outline-danger mt-1"
                                                onClick={() =>
                                                    handleDeleteComment(cmt.id)
                                                }
                                            >
                                                ลบ
                                            </button>
                                        )}
                                    </div>
                                ))}

                              
                                <form
                                    onSubmit={(e) =>
                                        handleAddComment(e, todo.id)
                                    }
                                    className="mt-2 row g-2 align-items-center"
                                >
                                    <div className="col-12 col-md-6">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="พิมพ์ความคิดเห็น..."
                                            value={commentInputs[todo.id] || ""}
                                            onChange={(e) =>
                                                setCommentInputs({
                                                    ...commentInputs,
                                                    [todo.id]: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <input
                                            type="file"
                                            className="form-control"
                                            onChange={(e) =>
                                                setCommentImages({
                                                    ...commentImages,
                                                    [todo.id]: e.target.files[0],
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="col-12 col-md-2 text-md-end">
                                        <button className="btn btn-outline-primary w-100 btn-sm">
                                            ส่ง
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}
