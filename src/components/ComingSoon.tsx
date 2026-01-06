import { Sparkles } from 'lucide-react';

interface ComingSoonProps {
  title: string;
}

export default function ComingSoon({ title }: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-lg opacity-40"></div>
            <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-full">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
          {title}
        </h1>

        <p className="text-lg text-slate-600 mb-2">敬请期待</p>

        <p className="text-slate-500 mb-8">
          我们正在为您精心打造这个功能，即将上线
        </p>

        <div className="flex justify-center">
          <div className="relative w-64 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="mt-12 pt-12 border-t border-slate-200">
          <p className="text-sm text-slate-600 mb-4">预计推出日期</p>
          <p className="text-2xl font-bold text-slate-800">敬请关注</p>
        </div>
      </div>
    </div>
  );
}
