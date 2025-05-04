'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/crossChainSwap/utils';

export default function Navbar() {
  const pathname = usePathname();

  const routes = [
    { name: 'Home', path: '/' },
    { name: 'Solver Dashboard', path: '/solver' },
    { name: 'Crosschain Swap', path: '/swap' },
  ];

  return (
    <nav className="bg-[#0f172a] border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-white">BaristaNet</span>
            </Link>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-4">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors relative',
                  pathname === route.path
                    ? 'text-blue-400 font-semibold'
                    : 'text-gray-300 hover:text-white'
                )}
              >
                {route.name}
                {pathname === route.path && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full"></span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
