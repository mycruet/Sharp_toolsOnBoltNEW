import { useState } from 'react';
import { Cpu, Lock, User, Waves } from 'lucide-react';
import Header from './components/Header';
import AccountInfoPanel from './components/AccountInfoPanel';
import Dashboard from './components/Dashboard';
import SystemManagement from './components/SystemManagement';
import ComingSoon from './components/ComingSoon';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAccountPanel, setShowAccountPanel] = useState(false);
  const [activeMenu, setActiveMenu] = useState('工作台');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = { username: '', password: '' };
    let isValid = true;

    if (!username.trim()) {
      newErrors.username = '请输入用户名';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = '请输入密码';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      console.log('登录信息:', { username, password });
      setIsLoggedIn(true);
      setIsLoading(false);
    }, 1500);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case '工作台':
        return <Dashboard />;
      case '应用管理':
        return <ComingSoon title="应用管理待上线" />;
      case '企业管理':
        return <ComingSoon title="企业管理待上线" />;
      case '系统管理':
        return <SystemManagement />;
      default:
        return <Dashboard />;
    }
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header
          onAccountInfoClick={() => setShowAccountPanel(true)}
          activeMenu={activeMenu}
          onMenuClick={setActiveMenu}
        />
        {renderContent()}
        <AccountInfoPanel
          isOpen={showAccountPanel}
          onClose={() => setShowAccountPanel(false)}
          accountData={{
            accountName: username,
            nickname: '用户昵称',
            phone: '13800138000',
            email: 'user@example.com',
            role: '系统管理员',
            organization: '技术部',
            createdDate: new Date().toLocaleDateString(),
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="absolute top-20 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-blue-400 rounded-full animate-ping delay-500"></div>
        <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-cyan-400 rounded-full animate-ping delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 md:p-10 border border-white/20">
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-lg opacity-60"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 p-4 rounded-2xl">
                <Cpu className="w-12 h-12 text-white" strokeWidth={1.5} />
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 text-center mb-2">
              物联数智化赋能平台
            </h1>
            <div className="flex items-center gap-2 text-slate-500">
              <Waves className="w-4 h-4" />
              <p className="text-sm">IoT Intelligence Empowerment Platform</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
                用户名
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) setErrors({ ...errors, username: '' });
                  }}
                  placeholder="请输入用户名"
                  className={`w-full pl-12 pr-4 py-3 border ${
                    errors.username ? 'border-red-500' : 'border-slate-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white`}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                密码
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  placeholder="请输入密码"
                  className={`w-full pl-12 pr-4 py-3 border ${
                    errors.password ? 'border-red-500' : 'border-slate-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white`}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>登录中...</span>
                </>
              ) : (
                <span>登录</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-center text-slate-500">
              © 2024 物联数智化赋能平台 | 安全登录
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-300">
            技术支持：IoT 云平台 · 数据安全加密传输
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
