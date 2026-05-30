import { useState } from 'react';
import { Lock, User, AlertCircle } from 'lucide-react';

const MOCK_USERS = [
  { username: 'admin', password: 'admin123', nickname: '系统管理员' },
  { username: 'zhangsan', password: 'zhang123', nickname: '张三' },
  { username: 'lisi', password: 'li123', nickname: '李四' },
  { username: 'wangwu', password: 'wang123', nickname: '王五' },
];

interface LoginPageProps {
  onLogin: (username: string, nickname: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('请输入用户名');
      return;
    }

    if (!password.trim()) {
      setError('请输入密码');
      return;
    }

    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    const user = MOCK_USERS.find(u => u.username === username.trim());

    if (!user) {
      setError('用户不存在');
      setIsLoading(false);
      return;
    }

    if (user.password !== password) {
      setError('密码错误');
      setIsLoading(false);
      return;
    }

    onLogin(user.username, user.nickname);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Industrial IoT Illustration */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />

          {/* Hexagon pattern overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hexagons" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
                <path d="M28 0L56 14V42L28 56L0 42V14L28 0Z" fill="none" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="0.5"/>
                <path d="M28 56L56 70V98L28 112L0 98V70L28 56Z" fill="none" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagons)" />
          </svg>

          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-pulse"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                backgroundColor: `rgba(${100 + Math.random() * 100}, ${180 + Math.random() * 75}, 255, ${0.3 + Math.random() * 0.5})`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}

          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {[...Array(8)].map((_, i) => {
              const x1 = Math.random() * 100;
              const y1 = Math.random() * 100;
              const x2 = Math.random() * 100;
              const y2 = Math.random() * 100;
              return (
                <line
                  key={i}
                  x1={`${x1}%`}
                  y1={`${y1}%`}
                  x2={`${x2}%`}
                  y2={`${y2}%`}
                  stroke="rgba(59, 130, 246, 0.15)"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;20"
                    dur={`${2 + Math.random() * 2}s`}
                    repeatCount="indefinite"
                  />
                </line>
              );
            })}
          </svg>

          {/* Glowing orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Central 3D Twin Visualization */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-80 h-80">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-spin" style={{ animationDuration: '20s' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50" />
            </div>

            {/* Middle rotating ring */}
            <div className="absolute inset-4 rounded-full border border-cyan-400/40 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50" />
            </div>

            {/* Inner rotating ring */}
            <div className="absolute inset-8 rounded-full border border-teal-400/30 animate-spin" style={{ animationDuration: '10s' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-teal-400 rounded-full shadow-lg shadow-teal-400/50" />
            </div>

            {/* Central hexagon core */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <svg width="120" height="120" viewBox="0 0 120 120" className="drop-shadow-2xl">
                  <defs>
                    <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#14b8a6" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <polygon
                    points="60,5 105,32.5 105,87.5 60,115 15,87.5 15,32.5"
                    fill="url(#hexGradient)"
                    filter="url(#glow)"
                    opacity="0.9"
                  />
                  <polygon
                    points="60,20 90,40 90,80 60,100 30,80 30,40"
                    fill="none"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="1"
                  />
                </svg>

                {/* Pulsing center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-white/20 rounded-full animate-ping" />
                  <div className="absolute w-4 h-4 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full shadow-lg shadow-cyan-400/50" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature badges */}
        <div className="absolute bottom-12 left-12 right-12">
          <div className="grid grid-cols-2 gap-4">
            {[
              { text: '无纸化办公', icon: '📄' },
              { text: '数据与业务闭环', icon: '🔄' },
              { text: '可视化', icon: '📊' },
              { text: '智能决策', icon: '🧠' },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-4 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
              >
                <span className="text-2xl">{feature.icon}</span>
                <span className="text-white/90 font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top corner decorative elements */}
        <div className="absolute top-8 left-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white font-bold text-lg">善</span>
            </div>
            <div className="text-white">
              <div className="text-lg font-bold">善器</div>
              <div className="text-xs text-white/60">IoT Intelligence Platform</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center bg-slate-50 p-8">
        <div className="w-full max-w-md">
          {/* Platform Logo */}
          <div className="flex flex-col items-center mb-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-xl shadow-blue-500/20">
                <span className="text-white font-bold text-3xl">善器</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 text-center mb-2">
              物联数智化赋能平台
            </h1>
            <p className="text-sm text-slate-500">
              IoT Intelligence Empowerment Platform
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
                    setError('');
                  }}
                  placeholder="请输入用户名"
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-slate-800 placeholder-slate-400"
                />
              </div>
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
                    setError('');
                  }}
                  placeholder="请输入密码"
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-slate-800 placeholder-slate-400"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3.5 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>登录中...</span>
                </>
              ) : (
                <span>登录</span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-slate-200">
            <p className="text-xs text-center text-slate-500 mb-2">
              © 2026 善器 · 物联数智化赋能平台
            </p>
            <p className="text-xs text-center text-slate-400">
              技术支持：support@shanqi-iot.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
