import { siGithub } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const repositories = [
  {
    label: "Radix UI",
    href: "#",
  },
  {
    label: "Base UI",
    href: "#",
  },
  {
    label: "React Aria",
    href: "#",
  },
  {
    label: "TanStack Start",
    href: "#",
  },
] as const;

export function GitHubRepositoriesMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button size="icon" aria-label="Open project repositories on GitHub" />}>
        <SimpleIcon icon={siGithub} className="fill-primary-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Project versions</DropdownMenuLabel>
          {repositories.map((repository) => (
            <DropdownMenuItem
              key={repository.label}
              render={<a href={repository.href} target="_blank" rel="noreferrer" />}
            >
              {repository.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
