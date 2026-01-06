import { useState } from 'react';
import { ChevronDown, Cpu } from 'lucide-react';
import UserMenu from './UserMenu';

interface HeaderProps {
  onAccountInfoClick: () => void;
  activeMenu: string;
  onMenuClick: (menu: string) => void;
}

export default function Header({ onAccountInfoClick, activeMenu, onMenuClick }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const menuItems = ['工作台', '应用管理', '企业管理', '系统管理'];

  const handleAccountInfo = () => {
    onAccountInfoClick();
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-lg">
              <Cpu className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
            <span className="text-lg font-bold text-slate-800">物联数智化赋能</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <button
                key={item}
                onClick={() => onMenuClick(item)}
                className={`font-medium transition-colors duration-200 relative group ${
                  activeMenu === item
                    ? 'text-blue-600'
                    : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                {item}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 transition-all duration-300 ${
                    activeMenu === item ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                ></span>
              </button>
            ))}
          </nav>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors duration-200"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-medium text-sm shadow-md">
              用户
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-600 transition-transform duration-200 ${
                showUserMenu ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showUserMenu && (
            <UserMenu
              onAccountInfo={handleAccountInfo}
              onClose={() => setShowUserMenu(false)}
            />
          )}
        </div>
      </div>
    </header>
  );
}
