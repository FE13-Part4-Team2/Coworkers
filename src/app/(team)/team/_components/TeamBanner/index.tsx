'use client';
import Image from 'next/image';
import TeamMenu from '@/app/(team)/team/_components/TeamBanner/TeamMenu';
import GradientScrollable from '@/components/common/Scroll/GradientScrollable';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { GroupResponse } from '@/lib/apis/group/type';
import {
  teamBannerWrapperStyle,
  teamBannerImgStyle,
  teamBannerTitleStyle,
} from '@/app/(team)/team/_components/styles';

const TeamBanner = ({
  group,
  userId,
}: {
  group: GroupResponse;
  userId: number;
}) => {
  const isAdmin = useIsAdmin({ membersData: group.members, userId });

  return (
    <div className={`${teamBannerWrapperStyle}`}>
      <Image
        src="/image/team_banner_pattern.svg"
        alt="팀 배너 배경 패턴 이미지"
        width={181}
        height={64}
        priority
        className={`${teamBannerImgStyle}`}
      />

      <div className={`${teamBannerTitleStyle}`}>
        <GradientScrollable>{group.name}</GradientScrollable>
      </div>

      {isAdmin && <TeamMenu group={group} />}
    </div>
  );
};

export default TeamBanner;
