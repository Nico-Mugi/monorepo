import { CheckIcon } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "../../avatar";
import { Button } from "../../button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../dropdown-menu";
import { useCalendar } from "../contexts/calendar-context";

export function UserSelect() {
  const {
    users,
    selectedUserIds,
    filterEventsBySelectedUsers,
    clearUserFilter,
    labels,
  } = useCalendar();

  const previewUsers =
    selectedUserIds.length > 0
      ? users.filter((user) => selectedUserIds.includes(user.id))
      : users;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            aria-label={labels.userSelectPlaceholder}
            data-testid="user-filter-trigger"
            className="w-fit px-2"
          />
        }
      >
        <AvatarGroup className="flex items-center">
          {previewUsers.slice(0, 3).map((user) => (
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
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            clearUserFilter();
          }}
        >
          <AvatarGroup className="mx-1 flex items-center">
            {users.slice(0, 3).map((user) => (
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
            {labels.userAll}
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
