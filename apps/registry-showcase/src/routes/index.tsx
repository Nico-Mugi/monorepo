import { useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { createColumnHelper, tableFeatures, useTable } from "@tanstack/react-table";
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
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CopyButton,
  DateTimeField,
  DataTable,
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
  NumberField,
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
              ? m.registry_demo_text_field_validation()
              : undefined,
        }}
      >
        {(field) => (
          <TextField
            field={field}
            label={m.registry_demo_text_field_label()}
            placeholder={m.registry_demo_text_field_placeholder()}
          />
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
        {(field) => (
          <ColorField field={field} label={m.registry_demo_color_field_label()} />
        )}
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
            label={m.registry_demo_select_field_label()}
            placeholder={m.registry_demo_select_field_placeholder()}
            options={[
              { value: "blue", label: m.registry_demo_color_blue() },
              { value: "green", label: m.registry_demo_color_green() },
              { value: "red", label: m.registry_demo_color_red() },
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
            label={m.registry_demo_textarea_field_label()}
            placeholder={m.registry_demo_textarea_field_placeholder()}
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
        {(field) => (
          <DateTimeField
            field={field}
            label={m.registry_demo_date_time_field_label()}
          />
        )}
      </form.Field>
    </div>
  );
}

function NumberFieldDemo() {
  const form = useForm({ defaultValues: { quantity: 1 } });
  return (
    <div className="max-w-sm">
      <form.Field name="quantity">
        {(field) => (
          <NumberField
            field={field}
            label={m.registry_demo_number_field_label()}
            suffix={m.registry_demo_number_field_suffix()}
            min={0}
          />
        )}
      </form.Field>
    </div>
  );
}

type DataTableDemoRow = { name: string; qty: number; price: string };

const dataTableDemoFeatures = tableFeatures({});
const dataTableDemoHelper = createColumnHelper<typeof dataTableDemoFeatures, DataTableDemoRow>();

function DataTableDemo() {
  const columns = dataTableDemoHelper.columns([
    dataTableDemoHelper.accessor("name", { header: m.registry_demo_data_table_column_name() }),
    dataTableDemoHelper.accessor("qty", { header: m.registry_demo_data_table_column_qty() }),
    dataTableDemoHelper.accessor("price", { header: m.registry_demo_data_table_column_price() }),
  ]);
  const data: DataTableDemoRow[] = [
    { name: m.registry_demo_data_table_row_1(), qty: 2, price: "45,00 €" },
    { name: m.registry_demo_data_table_row_2(), qty: 1, price: "120,00 €" },
  ];
  const table = useTable({ features: dataTableDemoFeatures, columns, data });
  return <DataTable table={table} columnCount={columns.length} className="max-w-sm" />;
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

function CommandDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        {m.registry_demo_command_open()}
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={m.registry_demo_command_placeholder()} />
        <CommandList>
          <CommandEmpty>{m.registry_demo_command_empty()}</CommandEmpty>
          <CommandGroup heading={m.registry_demo_command_suggestions()}>
            <CommandItem>{m.registry_demo_command_calendar()}</CommandItem>
            <CommandItem>{m.registry_demo_command_search()}</CommandItem>
            <CommandItem>{m.registry_demo_command_settings()}</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

function ToastDemo() {
  return (
    <>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            title: m.registry_demo_toast_title(),
            description: m.registry_demo_toast_description(),
            type: "success",
          })
        }
      >
        {m.registry_demo_toast_trigger()}
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
      <Input placeholder={m.registry_demo_input_placeholder()} />
      <Input placeholder={m.registry_demo_input_disabled_placeholder()} disabled />
    </div>
  ),
  label: () => (
    <div className="flex max-w-sm flex-col gap-2">
      <Label htmlFor="demo-label-input">{m.registry_demo_label_email()}</Label>
      <Input id="demo-label-input" type="email" placeholder="you@example.com" />
    </div>
  ),
  separator: () => (
    <div className="max-w-sm">
      <div className="text-sm">{m.registry_demo_separator_section_one()}</div>
      <Separator className="my-3" />
      <div className="text-sm">{m.registry_demo_separator_section_two()}</div>
      <div className="mt-3 flex h-8 items-center gap-3 text-sm">
        <span>{m.registry_demo_separator_left()}</span>
        <Separator orientation="vertical" />
        <span>{m.registry_demo_separator_right()}</span>
      </div>
    </div>
  ),
  field: () => (
    <div className="max-w-sm">
      <Field>
        <FieldLabel htmlFor="demo-field-input">
          {m.registry_demo_field_label()}
        </FieldLabel>
        <Input id="demo-field-input" placeholder="jane_doe" />
        <FieldDescription>{m.registry_demo_field_description()}</FieldDescription>
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
          {m.registry_demo_collapsible_trigger()}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 text-sm text-muted-foreground">
          {m.registry_demo_collapsible_content()}
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
      <Textarea placeholder={m.registry_demo_textarea_placeholder()} />
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
      <PopoverTrigger
        render={<Button variant="outline">{m.registry_demo_popover_trigger()}</Button>}
      />
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>{m.registry_demo_popover_title()}</PopoverTitle>
          <PopoverDescription>
            {m.registry_demo_popover_description()}
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
  "scroll-area": () => (
    <ScrollArea className="h-48 max-w-sm rounded-2xl border border-border p-4">
      <div className="flex flex-col gap-3 text-sm">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i}>{m.registry_demo_scroll_item({ n: i + 1 })}</div>
        ))}
      </div>
    </ScrollArea>
  ),
  switch: () => (
    <div className="flex items-center gap-2">
      <Switch id="demo-switch" defaultChecked />
      <Label htmlFor="demo-switch">{m.registry_demo_switch_label()}</Label>
    </div>
  ),
  tooltip: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={<Button variant="outline">{m.registry_demo_tooltip_trigger()}</Button>}
        />
        <TooltipContent>{m.registry_demo_tooltip_content()}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  tabs: () => (
    <Tabs defaultValue="account" className="max-w-sm">
      <TabsList>
        <TabsTrigger value="account">{m.registry_demo_tabs_account()}</TabsTrigger>
        <TabsTrigger value="password">{m.registry_demo_tabs_password()}</TabsTrigger>
      </TabsList>
      <TabsContent value="account">{m.registry_demo_tabs_account_content()}</TabsContent>
      <TabsContent value="password">{m.registry_demo_tabs_password_content()}</TabsContent>
    </Tabs>
  ),
  toggle: () => (
    <div className="flex gap-2">
      <Toggle aria-label={m.registry_demo_toggle_bold_label()} defaultPressed>
        B
      </Toggle>
      <Toggle aria-label={m.registry_demo_toggle_italic_label()}>I</Toggle>
    </div>
  ),
  calendar: () => <CalendarDemo />,
  "alert-dialog": () => (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant="destructive">
            {m.registry_demo_alert_dialog_trigger()}
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{m.registry_demo_alert_dialog_title()}</AlertDialogTitle>
          <AlertDialogDescription>
            {m.registry_demo_alert_dialog_description()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{m.registry_demo_cancel()}</AlertDialogCancel>
          <AlertDialogAction>{m.registry_demo_alert_dialog_continue()}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  dialog: () => (
    <Dialog>
      <DialogTrigger
        render={<Button variant="outline">{m.registry_demo_dialog_edit_profile()}</Button>}
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{m.registry_demo_dialog_edit_profile()}</DialogTitle>
          <DialogDescription>{m.registry_demo_dialog_description()}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">{m.registry_demo_cancel()}</Button>
          <Button>{m.registry_demo_dialog_save()}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  "dropdown-menu": () => (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline">{m.registry_demo_dropdown_trigger()}</Button>}
      />
      <DropdownMenuContent>
        <DropdownMenuLabel>{m.registry_demo_dropdown_label()}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>{m.registry_demo_dropdown_profile()}</DropdownMenuItem>
        <DropdownMenuItem>{m.registry_demo_dropdown_billing()}</DropdownMenuItem>
        <DropdownMenuItem variant="destructive">
          {m.registry_demo_dropdown_logout()}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  "responsive-modal": () => (
    <Modal>
      <ModalTrigger render={<Button variant="outline">{m.registry_demo_modal_trigger()}</Button>} />
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{m.registry_demo_modal_title()}</ModalTitle>
          <ModalDescription id="responsive-modal-description">
            {m.registry_demo_modal_description()}
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <ModalClose render={<Button variant="outline">{m.registry_demo_modal_close()}</Button>} />
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
  select: () => (
    <Select defaultValue="blue">
      <SelectTrigger className="w-40">
        <SelectValue placeholder={m.registry_demo_select_placeholder()} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="blue">{m.registry_demo_color_blue()}</SelectItem>
        <SelectItem value="green">{m.registry_demo_color_green()}</SelectItem>
        <SelectItem value="red">{m.registry_demo_color_red()}</SelectItem>
      </SelectContent>
    </Select>
  ),
  "input-group": () => (
    <div className="max-w-sm">
      <InputGroup>
        <InputGroupInput placeholder={m.registry_demo_input_group_placeholder()} />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label={m.registry_demo_input_group_submit()}
          >
            <SearchIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
  command: () => <CommandDemo />,
  "date-time-picker": () => <DateTimePickerDemo />,
  "select-field": () => <SelectFieldDemo />,
  "textarea-field": () => <TextareaFieldDemo />,
  "date-time-field": () => <DateTimeFieldDemo />,
  toast: () => <ToastDemo />,
  "number-field": () => <NumberFieldDemo />,
  "data-table": () => <DataTableDemo />,
};

// registry.json's own `description` is a single, unlocalized string (it also
// serves the shadcn CLI directly, e.g. as install output) — the showcase page
// shows this localized version instead, keyed by item name.
const descriptions: Record<string, () => string> = {
  button: m.registry_desc_button,
  input: m.registry_desc_input,
  label: m.registry_desc_label,
  separator: m.registry_desc_separator,
  field: m.registry_desc_field,
  "text-field": m.registry_desc_text_field,
  "color-field": m.registry_desc_color_field,
  "copy-button": m.registry_desc_copy_button,
  collapsible: m.registry_desc_collapsible,
  badge: m.registry_desc_badge,
  skeleton: m.registry_desc_skeleton,
  textarea: m.registry_desc_textarea,
  avatar: m.registry_desc_avatar,
  popover: m.registry_desc_popover,
  "scroll-area": m.registry_desc_scroll_area,
  switch: m.registry_desc_switch,
  tooltip: m.registry_desc_tooltip,
  tabs: m.registry_desc_tabs,
  toggle: m.registry_desc_toggle,
  calendar: m.registry_desc_calendar,
  "alert-dialog": m.registry_desc_alert_dialog,
  dialog: m.registry_desc_dialog,
  "dropdown-menu": m.registry_desc_dropdown_menu,
  "responsive-modal": m.registry_desc_responsive_modal,
  select: m.registry_desc_select,
  "input-group": m.registry_desc_input_group,
  command: m.registry_desc_command,
  "date-time-picker": m.registry_desc_date_time_picker,
  "select-field": m.registry_desc_select_field,
  "textarea-field": m.registry_desc_textarea_field,
  "date-time-field": m.registry_desc_date_time_field,
  toast: m.registry_desc_toast,
  "full-calendar": m.registry_desc_full_calendar,
  "number-field": m.registry_desc_number_field,
  "data-table": m.registry_desc_data_table,
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
              const description = descriptions[item.name]?.() ?? item.description;
              return (
                <section
                  key={item.name}
                  className="rounded-2xl border border-border p-6"
                >
                  <h2 className="text-xl font-semibold">
                    {item.title ?? item.name}
                  </h2>
                  {description ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {description}
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
