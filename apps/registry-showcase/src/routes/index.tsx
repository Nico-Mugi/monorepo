import { useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { ChevronRightIcon, SearchIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  Badge,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  ColorField,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CopyButton,
  DateTimeField,
  DateTimePicker,
  DayPicker,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Field,
  FieldDescription,
  FieldLabel,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  Label,
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
  ScrollArea,
  Select,
  SelectContent,
  SelectField,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Skeleton,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TextField,
  Textarea,
  TextareaField,
  toast,
  Toaster,
  Toggle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui";
import registryData from "@repo/registry/registry.json";
import { Nav } from "~/components/nav";
import { m } from "~/lib/paraglide/messages";

export const Route = createFileRoute("/")({
  component: Home,
});

interface RegistryItem {
  name: string;
  type: string;
  title?: string;
  description?: string;
}

const registry = registryData as {
  name: string;
  homepage: string;
  items: RegistryItem[];
};

// Blocks are too large to demo inline (see calendar.playground.nicolas-thouvenin.dev
// itself for the demo) — this maps a block's registry name to its live app instead.
const blockDemoLinks: Record<string, string> = {
  "full-calendar": "https://calendar.playground.nicolas-thouvenin.dev",
};

const buttonVariants = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const;

const buttonSizes = ["sm", "default", "lg"] as const;

function TextFieldDemo() {
  const form = useForm({ defaultValues: { name: "" } });
  return (
    <div className="max-w-sm">
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) =>
            value.length > 0 && value.length < 3
              ? "Must be at least 3 characters"
              : undefined,
        }}
      >
        {(field) => (
          <TextField field={field} label="Name" placeholder="Jane Doe" />
        )}
      </form.Field>
    </div>
  );
}

function ColorFieldDemo() {
  const form = useForm({ defaultValues: { accentColor: "#8faf83" } });
  return (
    <div className="max-w-sm">
      <form.Field name="accentColor">
        {(field) => <ColorField field={field} label="Accent color" />}
      </form.Field>
    </div>
  );
}

function SelectFieldDemo() {
  const form = useForm({ defaultValues: { color: "" } });
  return (
    <div className="max-w-sm">
      <form.Field name="color">
        {(field) => (
          <SelectField
            field={field}
            label="Favorite color"
            placeholder="Select a color"
            options={[
              { value: "blue", label: "Blue" },
              { value: "green", label: "Green" },
              { value: "red", label: "Red" },
            ]}
          />
        )}
      </form.Field>
    </div>
  );
}

function TextareaFieldDemo() {
  const form = useForm({ defaultValues: { bio: "" } });
  return (
    <div className="max-w-sm">
      <form.Field name="bio">
        {(field) => (
          <TextareaField
            field={field}
            label="Bio"
            placeholder="Tell us about yourself"
          />
        )}
      </form.Field>
    </div>
  );
}

function DateTimeFieldDemo() {
  const form = useForm({
    defaultValues: { when: undefined as Date | undefined },
  });
  return (
    <div className="max-w-sm">
      <form.Field name="when">
        {(field) => <DateTimeField field={field} label="Event date & time" />}
      </form.Field>
    </div>
  );
}

function DateTimePickerDemo() {
  const [value, setValue] = useState<Date | undefined>(undefined);
  return (
    <div className="max-w-sm">
      <DateTimePicker value={value} onChange={setValue} />
    </div>
  );
}

function CalendarDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <DayPicker
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-2xl border border-border"
    />
  );
}

function ToastDemo() {
  return (
    <>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            title: "Event created",
            description: "Your changes have been saved.",
            type: "success",
          })
        }
      >
        Show toast
      </Button>
      <Toaster />
    </>
  );
}

const demos: Record<string, () => ReactNode> = {
  button: () => (
    <div className="flex flex-col gap-4">
      {buttonSizes.map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-3">
          {buttonVariants.map((variant) => (
            <Button key={variant} variant={variant} size={size}>
              {variant}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
  input: () => (
    <div className="flex max-w-sm flex-col gap-3">
      <Input placeholder="Type something..." />
      <Input placeholder="Disabled" disabled />
    </div>
  ),
  label: () => (
    <div className="flex max-w-sm flex-col gap-2">
      <Label htmlFor="demo-label-input">Email</Label>
      <Input id="demo-label-input" type="email" placeholder="you@example.com" />
    </div>
  ),
  separator: () => (
    <div className="max-w-sm">
      <div className="text-sm">Section one</div>
      <Separator className="my-3" />
      <div className="text-sm">Section two</div>
      <div className="mt-3 flex h-8 items-center gap-3 text-sm">
        <span>Left</span>
        <Separator orientation="vertical" />
        <span>Right</span>
      </div>
    </div>
  ),
  field: () => (
    <div className="max-w-sm">
      <Field>
        <FieldLabel htmlFor="demo-field-input">Username</FieldLabel>
        <Input id="demo-field-input" placeholder="jane_doe" />
        <FieldDescription>Visible to other users.</FieldDescription>
      </Field>
    </div>
  ),
  "text-field": () => <TextFieldDemo />,
  "color-field": () => <ColorFieldDemo />,
  "copy-button": () => (
    <CopyButton
      text="pnpm dlx shadcn@latest add"
      label={m.registry_copy_cta()}
      copiedLabel={m.registry_copied_confirmation()}
    />
  ),
  collapsible: () => (
    <div className="max-w-sm">
      <Collapsible>
        <CollapsibleTrigger className="group/collapsible flex items-center gap-1.5 text-sm font-medium">
          <ChevronRightIcon
            size={16}
            className="transition-transform group-data-panel-open/collapsible:rotate-90"
          />
          Toggle content
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 text-sm text-muted-foreground">
          This content is hidden until the trigger above is clicked.
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
  badge: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
    </div>
  ),
  skeleton: () => (
    <div className="flex max-w-sm items-center gap-4">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  ),
  textarea: () => (
    <div className="max-w-sm">
      <Textarea placeholder="Type your message..." />
    </div>
  ),
  avatar: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Avatar size="sm">
          <AvatarFallback>SM</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>MD</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback>LG</AvatarFallback>
          <AvatarBadge />
        </Avatar>
      </div>
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>CD</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>EF</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>
    </div>
  ),
  popover: () => (
    <Popover>
      <PopoverTrigger render={<Button variant="outline">Open popover</Button>} />
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>
            Set the dimensions for the layer.
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
  "scroll-area": () => (
    <ScrollArea className="h-48 max-w-sm rounded-2xl border border-border p-4">
      <div className="flex flex-col gap-3 text-sm">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i}>Item {i + 1}</div>
        ))}
      </div>
    </ScrollArea>
  ),
  switch: () => (
    <div className="flex items-center gap-2">
      <Switch id="demo-switch" defaultChecked />
      <Label htmlFor="demo-switch">Enable notifications</Label>
    </div>
  ),
  tooltip: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
        <TooltipContent>Helpful hint</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  tabs: () => (
    <Tabs defaultValue="account" className="max-w-sm">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Manage your account settings.</TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  ),
  toggle: () => (
    <div className="flex gap-2">
      <Toggle aria-label="Toggle bold" defaultPressed>
        B
      </Toggle>
      <Toggle aria-label="Toggle italic">I</Toggle>
    </div>
  ),
  calendar: () => <CalendarDemo />,
  "alert-dialog": () => (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button variant="destructive">Delete account</Button>}
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  dialog: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Edit profile</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  "dropdown-menu": () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline">Options</Button>} />
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  "responsive-modal": () => (
    <Modal>
      <ModalTrigger render={<Button variant="outline">Open modal</Button>} />
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Share this document</ModalTitle>
          <ModalDescription id="responsive-modal-description">
            Centers on desktop, slides up from the bottom on mobile.
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <ModalClose render={<Button variant="outline">Close</Button>} />
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
  select: () => (
    <Select defaultValue="blue">
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Pick a color" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="blue">Blue</SelectItem>
        <SelectItem value="green">Green</SelectItem>
        <SelectItem value="red">Red</SelectItem>
      </SelectContent>
    </Select>
  ),
  "input-group": () => (
    <div className="max-w-sm">
      <InputGroup>
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" aria-label="Submit">
            <SearchIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
  command: () => (
    <Command className="max-w-sm rounded-2xl border border-border">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search</CommandItem>
          <CommandItem>Settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
  "date-time-picker": () => <DateTimePickerDemo />,
  "select-field": () => <SelectFieldDemo />,
  "textarea-field": () => <TextareaFieldDemo />,
  "date-time-field": () => <DateTimeFieldDemo />,
  toast: () => <ToastDemo />,
};

function Home() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Nav />
      <main className="mx-auto max-w-3xl px-6 pt-24 pb-16">
        <header className="mb-12">
          <h1 className="text-4xl font-bold">{registry.name}</h1>
          <p className="mt-2 text-muted-foreground">
            {m.registry_hero_description()}
          </p>
        </header>

        {registry.items.length === 0 ? (
          <p className="text-muted-foreground">{m.registry_empty_state()}</p>
        ) : (
          <div className="flex flex-col gap-10">
            {registry.items.map((item) => {
              const installCommand = `pnpm dlx shadcn@latest add ${registry.homepage}/r/${item.name}.json`;
              const blockDemoLink = blockDemoLinks[item.name];
              return (
                <section
                  key={item.name}
                  className="rounded-2xl border border-border p-6"
                >
                  <h2 className="text-xl font-semibold">
                    {item.title ?? item.name}
                  </h2>
                  {item.description ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  ) : null}
                  <div className="mt-6">
                    {blockDemoLink ? (
                      <a
                        href={blockDemoLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                      >
                        {m.registry_block_live_demo_cta()} →
                      </a>
                    ) : demos[item.name] ? (
                      demos[item.name]()
                    ) : (
                      <p className="text-sm text-muted-foreground/70">
                        {m.registry_no_preview({ name: item.name })}
                      </p>
                    )}
                  </div>
                  <div className="mt-6 flex items-center justify-end">
                    <CopyButton
                      text={installCommand}
                      label={m.registry_copy_cta()}
                      copiedLabel={m.registry_copied_confirmation()}
                      size="xs"
                    />
                  </div>
                  <pre className="mt-2 overflow-x-auto rounded-lg bg-muted px-4 py-3 text-sm text-foreground/90">
                    <code>{installCommand}</code>
                  </pre>
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
