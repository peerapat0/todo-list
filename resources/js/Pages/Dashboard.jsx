import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { ClipboardList } from 'lucide-react'; // ไอคอนเท่ ๆ จาก lucide-react

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-16 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="bg-white shadow-lg rounded-2xl p-10 max-w-lg text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        👋 ยินดีต้อนรับเข้าสู่ระบบ!
                    </h1>
                    <p className="text-gray-600 mb-8">
                        จัดการรายการสิ่งที่ต้องทำของคุณได้ง่าย ๆ ที่นี่
                    </p>

                    <Link
                        href={route('todos.index')}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all duration-200 transform hover:scale-105"
                    >
                        <ClipboardList className="w-5 h-5" />
                        ไปที่หน้า Todo
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
