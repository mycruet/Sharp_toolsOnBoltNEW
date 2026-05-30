import { X } from 'lucide-react';
import {
  AppWindow,
  Database,
  BarChart3,
  Zap,
  Globe,
  Settings,
  Lock,
  Users,
  Package,
  Layers,
  Code,
  Paperclip,
  Inbox,
  Calendar,
  MessageSquare,
  Activity,
  Briefcase,
  Search,
} from 'lucide-react';

export interface LogoOption {
  name: string;
  icon: React.ReactNode;
  label: string;
}

const LOGO_LIBRARY: LogoOption[] = [
  { name: 'app', icon: <AppWindow className="w-6 h-6" />, label: '应用' },
  { name: 'database', icon: <Database className="w-6 h-6" />, label: '数据库' },
  { name: 'chart', icon: <BarChart3 className="w-6 h-6" />, label: '图表' },
  { name: 'zap', icon: <Zap className="w-6 h-6" />, label: '闪电' },
  { name: 'globe', icon: <Globe className="w-6 h-6" />, label: '全球' },
  { name: 'settings', icon: <Settings className="w-6 h-6" />, label: '设置' },
  { name: 'lock', icon: <Lock className="w-6 h-6" />, label: '锁定' },
  { name: 'users', icon: <Users className="w-6 h-6" />, label: '用户' },
  { name: 'package', icon: <Package className="w-6 h-6" />, label: '包裹' },
  { name: 'layers', icon: <Layers className="w-6 h-6" />, label: '图层' },
  { name: 'code', icon: <Code className="w-6 h-6" />, label: '代码' },
  { name: 'paperclip', icon: <Paperclip className="w-6 h-6" />, label: '附件' },
  { name: 'inbox', icon: <Inbox className="w-6 h-6" />, label: '收件箱' },
  { name: 'calendar', icon: <Calendar className="w-6 h-6" />, label: '日历' },
  { name: 'message', icon: <MessageSquare className="w-6 h-6" />, label: '消息' },
  { name: 'activity', icon: <Activity className="w-6 h-6" />, label: '活动' },
  { name: 'briefcase', icon: <Briefcase className="w-6 h-6" />, label: '公事包' },
  { name: 'search', icon: <Search className="w-6 h-6" />, label: '搜索' },
];

interface LogoSelectorProps {
  onSelect: (logoName: string) => void;
  onClose: () => void;
}

export function getLogoByName(name: string): React.ReactNode {
  const logo = LOGO_LIBRARY.find(l => l.name === name);
  return logo ? logo.icon : LOGO_LIBRARY[0].icon;
}

export function getLogoLabel(name: string): string {
  const logo = LOGO_LIBRARY.find(l => l.name === name);
  return logo ? logo.label : '应用';
}

export default function LogoSelector({ onSelect, onClose }: LogoSelectorProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-md">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">选择应用图标</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-4 gap-3">
            {LOGO_LIBRARY.map(logo => (
              <button
                key={logo.name}
                onClick={() => onSelect(logo.name)}
                className="flex flex-col items-center gap-2 p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
              >
                <div className="text-slate-600 group-hover:text-blue-600 transition-colors">
                  {logo.icon}
                </div>
                <span className="text-xs text-slate-600 group-hover:text-blue-600 text-center font-medium transition-colors">
                  {logo.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
