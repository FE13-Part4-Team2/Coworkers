'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import JoinTeamForm from '@/app/(team)/_components/JoinTeamForm';
import { postGroupInvitation } from '@/lib/apis/group';
import { INVITATION_ERROR_MAP } from '@/utils/errorMap';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/lib/apis/user';

const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

export default function JoinTeamPage() {
  const router = useRouter();

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => getUser({}),
    enabled: true,
  });

  const [link, setLink] = useState('');
  const [error, setError] = useState<string>();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setError(undefined);
  }, [link]);

  const handleJoin = async () => {
    if (!jwtRegex.test(link.trim())) {
      setError('유효한 링크가 아닙니다.');
      return;
    }
    const email = currentUser?.email;

    if (!email) {
      setError('사용자 정보를 불러올 수 없습니다.');
      return;
    }

    setLoading(true);
    try {
      const res = await postGroupInvitation({
        body: { token: link.trim(), userEmail: email },
      });
      if (res?.groupId == null) {
        throw new Error(res?.message || '초대 수락 실패');
      }
      router.push(ROUTES.TEAM(res.groupId));
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : String(err);
      setError(
        INVITATION_ERROR_MAP[raw] ?? '초대 수락 중 오류가 발생했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full justify-center pt-35">
      <JoinTeamForm
        link={link}
        onLinkChange={setLink}
        onSubmit={handleJoin}
        error={error}
        isLoading={isLoading}
      />
    </div>
  );
}
