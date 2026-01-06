import { LogOut, User } from 'lucide-react';

interface UserMenuProps {
  onAccountInfo: () => void;
  onClose: () => void;
}

export default function UserMenu({ onAccountInfo, onClose }: UserMenuProps) {
  const handleLogout = () => {
    console.log('User logged out');
    alert('已登出系统');
    onClose();
  };

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      <button
        onClick={onAccountInfo}
        className="w-full px-4 py-3 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors duration-200 border-b border-slate-100"
      >
        <User className="w-4 h-4 text-blue-600" />
        <span className="font-medium">账号信息</span>
      </button>
      <button
        onClick={handleLogout}
        className="w-full px-4 py-3 text-left text-slate-700 hover:bg-red-50 flex items-center gap-3 transition-colors duration-200"
      >
        <LogOut className="w-4 h-4 text-red-600" />
        <span className="font-medium">登出</span>
      </button>
    </div>
  );
}
