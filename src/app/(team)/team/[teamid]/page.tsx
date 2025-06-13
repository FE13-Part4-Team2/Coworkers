import { cookies } from 'next/headers';
import { getGroupById } from '@/lib/apis/group';
import TeamBanner from '@/app/(team)/team/_components/TeamBanner';
import TaskListBarList from '@/app/(team)/team/_components/TaskListBarList';
import ReportBanner from '@/app/(team)/team/_components/ReportBanner';
import MemberList from '@/app/(team)/team/_components/MemberList';
import AddButton from '@/app/(team)/team/_components/AddButton';
import { calculateProgress } from '@/utils/calculateProgress';
import { teamHeaderStyle } from '@/app/(team)/team/_components/styles';

export default async function TeamPage({
  params,
}: {
  params: { teamid: string };
  searchParams: { taskListId: string; date: string };
}) {
  const userId = cookies().get('userId')?.value;
  const groupId = Number(params.teamid);

  const groupData = await getGroupById({ groupId, tag: ['group'] });
  const membersData = groupData?.members ?? [];
  const taskListsData = groupData?.taskLists ?? [];

  const allTasks =
    groupData?.taskLists?.flatMap((taskList) => taskList.tasks ?? []) ?? [];
  const { total, done, progress } = calculateProgress(allTasks);

  if (!groupData) return;

  return (
    <div className="flex w-full flex-col items-center p-6">
      <TeamBanner group={groupData} userId={Number(userId)} />

      {/* 할 일 목록 */}
      <div className={`${teamHeaderStyle} mt-6`}>
        <div className="flex items-center gap-2">
          <h1 className="lg-medium">할 일 목록</h1>
          <span className="text-lg-regular text-slate-500">
            ({taskListsData.length}개)
          </span>
        </div>
        <AddButton variant="tasklist" groupId={groupId} />
      </div>
      <TaskListBarList
        key={taskListsData.length}
        items={taskListsData}
        groupId={groupId}
        userId={Number(userId)}
        membersData={membersData}
      />

      {/* 리포트 */}
      <div className={`${teamHeaderStyle} mt-8`}>
        <h1 className="lg-medium">리포트</h1>
      </div>
      <ReportBanner progress={progress} total={total} done={done} />

      {/* 멤버 */}
      <div className={`${teamHeaderStyle} mt-12`}>
        <div className="flex items-center gap-2">
          <h1 className="lg-medium">멤버</h1>
          <span className="text-lg-regular text-slate-500">
            ({membersData.length}명)
          </span>
        </div>
        <AddButton variant="member" groupId={groupId} />
      </div>
      <MemberList
        group={groupData}
        items={membersData}
        userId={Number(userId)}
      />
    </div>
  );
}
