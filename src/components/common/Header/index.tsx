'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import IconRenderer from '@/components/common/Icons/IconRenderer';
import Logo from './Logo';
import TeamMenu from './TeamMenu';
import UserMenu from './UserMenu';
import SideMenu from './SideMenu';
import { useAuth } from '@/hooks/useAuth';
import { useMemberships } from '@/hooks/useMemberships';
import { getUser } from '@/lib/apis/user';
import { UserResponse } from '@/lib/apis/user/type';
import { ROUTES } from '@/constants/routes';
import { usePathname } from 'next/navigation';

export default function Header() {
  const isLogin = useAuth();
  const { memberships, selectedGroup, setSelectedGroup } =
    useMemberships(isLogin);
  const [isSideMenuOpen, setSideMenuOpen] = useState(false);

  const pathname = usePathname();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['memberships'] });
    queryClient.invalidateQueries({ queryKey: ['currentUser'] });
  }, [pathname, queryClient]);

  const logoHref = selectedGroup
    ? ROUTES.TEAM(selectedGroup.id)
    : ROUTES.TEAM_NO;

  const { data: currentUser } = useQuery<UserResponse, Error>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const fetchedUser = await getUser({});
      if (!fetchedUser) throw new Error('유저 정보를 가져오지 못했습니다');
      return fetchedUser;
    },
    enabled: isLogin,
  });

  const handleLogout = () => {
    Cookies.remove('accessToken', {
      path: '/',
      secure: true,
      sameSite: 'Strict',
    });

    Cookies.remove('refreshToken', {
      path: '/',
      secure: true,
      sameSite: 'Strict',
    });
    Cookies.remove('userId', { path: '/', secure: true, sameSite: 'Strict' });
    location.href = '/';
    toast.success('로그아웃 되었습니다');
  };

  if (!isLogin) {
    return (
      <header className="h-[60px] w-full justify-center border-b border-slate-50/10 bg-slate-800 px-6 py-5">
        <div className="text-md-medium mx-auto flex h-full w-full max-w-[1200px] items-center justify-between leading-6 text-white">
          <Link
            href={ROUTES.HOME}
            className="laptop:w-[158px] flex w-[102px] items-center justify-between gap-0.5"
          >
            <IconRenderer name="LogoIcon" className="hover: cursor-pointer" />
            <IconRenderer name="CoworkersIcon" className="h-8 w-33" />
          </Link>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="h-[60px] w-full justify-center border-b border-slate-50/10 bg-slate-800 px-6 py-5">
        <div className="text-lg-medium mx-auto flex h-full w-full max-w-[1200px] items-center justify-between leading-6 text-white">
          <nav className="flex items-center justify-between">
            <IconRenderer
              name="GnbMenuIcon"
              className="tablet:hidden mr-4 block cursor-pointer hover:text-gray-700"
              onClick={() => setSideMenuOpen(true)}
            />
            <Logo href={logoHref} />

            <div className="tablet:flex hidden items-center">
              {memberships.length > 0 && selectedGroup && (
                <TeamMenu
                  memberships={memberships}
                  selectedGroup={selectedGroup}
                  onSelect={setSelectedGroup}
                />
              )}
              <Link
                href={ROUTES.BOARDS}
                className="text-md ml-8 font-medium hover:text-gray-700"
              >
                자유게시판
              </Link>
            </div>
          </nav>

          <UserMenu nickname={currentUser?.nickname} onLogout={handleLogout} />
        </div>
      </header>

      <SideMenu
        isSideMenuOpen={isSideMenuOpen}
        onClose={() => setSideMenuOpen(false)}
        memberships={memberships}
      />
    </>
  );
}
