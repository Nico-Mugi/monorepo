import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";
import { Calendar, type CalendarLabels } from "@repo/ui";
import { Nav } from "~/components/nav";
import { getEvents, getUsers } from "~/data/requests";
import { getDateFnsLocale } from "~/lib/date-locale";
import { m } from "~/lib/paraglide/messages";
import { Suspense } from "react";

const calendarLabels: Partial<CalendarLabels> = {
  addEvent: m.calendar_calendar_add_event(),
  eventCount: (count) => m.calendar_calendar_event_count({ count }),
  colorBlue: m.calendar_color_blue(),
  colorGreen: m.calendar_color_green(),
  colorRed: m.calendar_color_red(),
  colorYellow: m.calendar_color_yellow(),
  colorPurple: m.calendar_color_purple(),
  colorOrange: m.calendar_color_orange(),
  filterClear: m.calendar_filter_clear(),
  viewAgenda: m.calendar_view_agenda(),
  viewDay: m.calendar_view_day(),
  viewWeek: m.calendar_view_week(),
  viewMonth: m.calendar_view_month(),
  viewYear: m.calendar_view_year(),
  userSelectPlaceholder: m.calendar_user_select_placeholder(),
  userAll: m.calendar_user_all(),
  dialogEditEventTitle: m.calendar_dialog_edit_event_title(),
  dialogAddEventTitle: m.calendar_dialog_add_event_title(),
  dialogEditEventDescription: m.calendar_dialog_edit_event_description(),
  dialogAddEventDescription: m.calendar_dialog_add_event_description(),
  dialogFieldTitle: m.calendar_dialog_field_title(),
  dialogTitlePlaceholder: m.calendar_dialog_title_placeholder(),
  dialogFieldVariant: m.calendar_dialog_field_variant(),
  dialogVariantPlaceholder: m.calendar_dialog_variant_placeholder(),
  dialogFieldDescription: m.calendar_dialog_field_description(),
  dialogDescriptionPlaceholder: m.calendar_dialog_description_placeholder(),
  dialogStartDate: m.calendar_dialog_start_date(),
  dialogEndDate: m.calendar_dialog_end_date(),
  dialogCancel: m.calendar_dialog_cancel(),
  dialogSaveChanges: m.calendar_dialog_save_changes(),
  dialogCreateEvent: m.calendar_dialog_create_event(),
  toastEventUpdated: m.calendar_toast_event_updated(),
  toastEventCreated: m.calendar_toast_event_created(),
  toastEventEditFailed: m.calendar_toast_event_edit_failed(),
  toastEventAddFailed: m.calendar_toast_event_add_failed(),
  dialogDeleteButton: m.calendar_dialog_delete_button(),
  dialogDeleteTitle: m.calendar_dialog_delete_title(),
  dialogDeleteDescription: m.calendar_dialog_delete_description(),
  dialogDeleteCancel: m.calendar_dialog_delete_cancel(),
  dialogDeleteContinue: m.calendar_dialog_delete_continue(),
  toastEventDeleted: m.calendar_toast_event_deleted(),
  toastEventDeleteError: m.calendar_toast_event_delete_error(),
  dialogResponsible: m.calendar_dialog_responsible(),
  dialogAt: m.calendar_dialog_at(),
  dialogDescriptionLabel: m.calendar_dialog_description_label(),
  dialogEditButton: m.calendar_dialog_edit_button(),
  dialogDeleteEventButton: m.calendar_dialog_delete_event_button(),
  dialogMore: m.calendar_dialog_more(),
  eventsOn: (date) => m.calendar_dialog_events_on({ date: date.getTime() }),
  dialogNoEvents: m.calendar_dialog_no_events(),
  settingsLabel: m.calendar_settings_label(),
  settingsDotBadge: m.calendar_settings_dot_badge(),
  settings24h: m.calendar_settings_24h(),
  settingsDaysStartAt: m.calendar_settings_days_start_at(),
  settingsH: m.calendar_settings_h(),
  settingsAgendaGroupBy: m.calendar_settings_agenda_group_by(),
  settingsGroupByDate: m.calendar_settings_group_by_date(),
  settingsGroupByColor: m.calendar_settings_group_by_color(),
  agendaSearchPlaceholder: m.calendar_agenda_search_placeholder(),
  agendaNoResults: m.calendar_agenda_no_results(),
  agendaAt: m.calendar_agenda_at(),
  weekViewMobileWarning: m.calendar_week_view_mobile_warning(),
  weekViewMobileSuggestion: m.calendar_week_view_mobile_suggestion(),
  dayHappeningNow: m.calendar_day_happening_now(),
  dayNoAppointments: m.calendar_day_no_appointments(),
  eventDayOfBadge: (currentDay, totalDays) =>
    m.calendar_event_day_of_badge({ currentDay, totalDays }),
};

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { e2e?: boolean } => ({
    e2e:
      search.e2e === 1 || search.e2e === "1" || search.e2e === true
        ? true
        : undefined,
  }),
  loaderDeps: ({ search }) => ({ e2e: search.e2e }),
  loader: async ({ deps }) => {
    const [events, users] = await Promise.all([
      getEvents({ e2e: deps.e2e }),
      getUsers(),
    ]);
    return { events, users };
  },
  component: Home,
});

function Home() {
  const { events, users } = Route.useLoaderData();
  return (
    <>
      <Nav />
      <main className="flex max-h-screen flex-col pt-24 pb-16">
        <div className="container p-4 md:mx-auto">
          <ClientOnly>
            <Suspense fallback={<Loader2Icon className="animate-spin" />}>
              <Calendar
                events={events}
                users={users}
                labels={calendarLabels}
                locale={getDateFnsLocale()}
              />
            </Suspense>
          </ClientOnly>
        </div>
      </main>
    </>
  );
}
