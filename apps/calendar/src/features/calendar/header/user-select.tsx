import { CheckIcon } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/shadcn/ui/avatar";
import { AvatarGroup } from "~/components/shadcn/ui/avatar-group";
import { Button } from "~/components/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/shadcn/ui/dropdown-menu";
import { useCalendar } from "~/features/calendar/contexts/calendar-context";
import * as m from "~/lib/paraglide/messages";

export function UserSelect() {
  const {
    users,
    selectedUserIds,
    filterEventsBySelectedUsers,
    clearUserFilter,
  } = useCalendar();

  const previewUsers =
    selectedUserIds.length > 0
      ? users.filter((user) => selectedUserIds.includes(user.id))
      : users;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          aria-label={m.calendar_user_select_placeholder()}
          data-testid="user-filter-trigger"
          className="w-fit px-2"
        >
          <AvatarGroup className="flex items-center" max={3}>
            {previewUsers.map((user) => (
              <Avatar key={user.id} className="size-6 text-[10px]">
                <AvatarImage
                  src={user.picturePath ?? undefined}
                  alt={user.name}
                />
                <AvatarFallback className="text-[10px]">
                  {user.name[0]}
                </AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            clearUserFilter();
          }}
        >
          <AvatarGroup className="mx-1 flex items-center" max={3}>
            {users.map((user) => (
              <Avatar key={user.id} className="size-6 text-[10px]">
                <AvatarImage
                  src={user.picturePath ?? undefined}
                  alt={user.name}
                />
                <AvatarFallback className="text-[10px]">
                  {user.name[0]}
                </AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
          <span className="flex flex-1 items-center justify-between gap-2">
            {m.calendar_user_all()}
            {selectedUserIds.length === 0 && (
              <span className="text-blue-500">
                <CheckIcon className="size-4" />
              </span>
            )}
          </span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {users.map((user) => (
          <DropdownMenuItem
            key={user.id}
            className="flex items-center gap-2 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              filterEventsBySelectedUsers(user.id);
            }}
          >
            <Avatar className="size-6">
              <AvatarImage
                src={user.picturePath ?? undefined}
                alt={user.name}
              />
              <AvatarFallback className="text-[10px]">
                {user.name[0]}
              </AvatarFallback>
            </Avatar>
            <span className="flex flex-1 items-center justify-between gap-2 truncate">
              <p className="truncate">{user.name}</p>
              {selectedUserIds.includes(user.id) && (
                <span className="text-blue-500">
                  <CheckIcon className="size-4" />
                </span>
              )}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
