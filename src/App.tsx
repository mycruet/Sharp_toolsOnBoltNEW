import { useState, useEffect } from 'react';
import Header from './components/Header';
import AccountInfoPanel from './components/AccountInfoPanel';
import Dashboard from './components/Dashboard';
import SystemManagement from './components/SystemManagement';
import EnterpriseManagement from './components/EnterpriseManagement';
import LoginPage from './components/LoginPage';
import { useMenuVisibility } from './hooks/useMenuVisibility';

const NAV_MENU_MAP: Record<string, string> = {
  'nav.dashboard': '工作台',
  'nav.enterprise': '企业管理',
  'nav.system': '系统管理',
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAccountPanel, setShowAccountPanel] = useState(false);
  const [activeMenu, setActiveMenu] = useState('工作台');
  const [currentUser, setCurrentUser] = useState<{ username: string; nickname: string } | null>(null);
  const { isVisible } = useMenuVisibility();

  const visibleNavLabels = Object.entries(NAV_MENU_MAP)
    .filter(([key]) => isVisible(key))
    .map(([, label]) => label);

  useEffect(() => {
    if (visibleNavLabels.length > 0 && !visibleNavLabels.includes(activeMenu)) {
      setActiveMenu(visibleNavLabels[0]);
    }
  }, [visibleNavLabels.length]);

  const handleLogin = (username: string, nickname: string) => {
    setCurrentUser({ username, nickname });
    setIsLoggedIn(true);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case '工作台':
        return <Dashboard />;
      case '企业管理':
        return <EnterpriseManagement />;
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
            accountName: currentUser?.username || '',
            nickname: currentUser?.nickname || '用户昵称',
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

  return <LoginPage onLogin={handleLogin} />;
}

export default App;
