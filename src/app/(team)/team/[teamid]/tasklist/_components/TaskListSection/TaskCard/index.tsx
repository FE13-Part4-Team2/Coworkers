import { TaskResponse } from '@/lib/apis/task/type';
import TitleButton from '@/app/(team)/team/[teamid]/tasklist/_components/TaskListSection/TaskCard/TitleButton';
import IconRenderer from '@/components/common/Icons/IconRenderer';
import TaskMenu from '@/components/task/TaskMenu';
import DateInfo from '@/components/task/DateInfo';
import FrequencyInfo from '@/components/task/FrequencyInfo';
import ToggleTaskDoneButton from '@/components/task/ToggleTaskDoneButton';

export default function TaskCard({
  id,
  date,
  doneAt,
  name,
  description,
  frequency,
  commentCount,
}: TaskResponse) {
  return (
    <div className="flex flex-col gap-2.5 rounded-lg bg-slate-800 px-[14px] py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <ToggleTaskDoneButton taskId={id} doneAt={doneAt} />
            <TitleButton name={name} id={id} doneAt={doneAt} />
          </div>
          <div className="flex items-center gap-0.5">
            <IconRenderer name="CommentIcon" size={16} />
            <div className="text-xs-regular text-slate-500">{commentCount}</div>
          </div>
        </div>
        <TaskMenu
          taskId={id}
          taskName={name}
          taskDescription={description}
          size="sm"
        />
      </div>
      <div className="flex items-center gap-2.5">
        <DateInfo date={date} />
        <FrequencyInfo frequency={frequency} />
      </div>
    </div>
  );
}
