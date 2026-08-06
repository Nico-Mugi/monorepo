export type CalendarLabels = {
  addEvent: string;
  eventCount: (count: number) => string;
  colorBlue: string;
  colorGreen: string;
  colorRed: string;
  colorYellow: string;
  colorPurple: string;
  colorOrange: string;
  filterClear: string;
  viewAgenda: string;
  viewDay: string;
  viewWeek: string;
  viewMonth: string;
  viewYear: string;
  userSelectPlaceholder: string;
  userAll: string;
  dialogEditEventTitle: string;
  dialogAddEventTitle: string;
  dialogEditEventDescription: string;
  dialogAddEventDescription: string;
  dialogFieldTitle: string;
  dialogTitlePlaceholder: string;
  dialogFieldVariant: string;
  dialogVariantPlaceholder: string;
  dialogFieldDescription: string;
  dialogDescriptionPlaceholder: string;
  dialogStartDate: string;
  dialogEndDate: string;
  dialogCancel: string;
  dialogSaveChanges: string;
  dialogCreateEvent: string;
  toastEventUpdated: string;
  toastEventCreated: string;
  toastEventEditFailed: string;
  toastEventAddFailed: string;
  toastEventMoved: string;
  toastEventMoveFailed: string;
  dialogDeleteButton: string;
  dialogDeleteTitle: string;
  dialogDeleteDescription: string;
  dialogDeleteCancel: string;
  dialogDeleteContinue: string;
  toastEventDeleted: string;
  toastEventDeleteError: string;
  dialogResponsible: string;
  dialogAt: string;
  dialogDescriptionLabel: string;
  dialogEditButton: string;
  dialogDeleteEventButton: string;
  dialogMore: string;
  eventsOn: (date: Date) => string;
  dialogNoEvents: string;
  settingsLabel: string;
  settingsDotBadge: string;
  settings24h: string;
  settingsDaysStartAt: string;
  settingsH: string;
  settingsAgendaGroupBy: string;
  settingsGroupByDate: string;
  settingsGroupByColor: string;
  agendaSearchPlaceholder: string;
  agendaNoResults: string;
  agendaAt: string;
  weekViewMobileWarning: string;
  weekViewMobileSuggestion: string;
  dayHappeningNow: string;
  dayNoAppointments: string;
  eventDayOfBadge: (currentDay: number, totalDays: number) => string;
  filterEventsLabel: string;
  settingsTrigger: string;
  previous: string;
  next: string;
  today: string;
};

export const defaultCalendarLabels: CalendarLabels = {
  addEvent: "Add Event",
  eventCount: (count) => `${count} ${count === 1 ? "event" : "events"}`,
  colorBlue: "Blue",
  colorGreen: "Green",
  colorRed: "Red",
  colorYellow: "Yellow",
  colorPurple: "Purple",
  colorOrange: "Orange",
  filterClear: "Clear Filter",
  viewAgenda: "Agenda",
  viewDay: "Day",
  viewWeek: "Week",
  viewMonth: "Month",
  viewYear: "Year",
  userSelectPlaceholder: "Select a user",
  userAll: "All",
  dialogEditEventTitle: "Edit Event",
  dialogAddEventTitle: "Add New Event",
  dialogEditEventDescription: "Modify your existing event.",
  dialogAddEventDescription: "Create a new event for your calendar.",
  dialogFieldTitle: "Title",
  dialogTitlePlaceholder: "Enter a title",
  dialogFieldVariant: "Variant",
  dialogVariantPlaceholder: "Select a variant",
  dialogFieldDescription: "Description",
  dialogDescriptionPlaceholder: "Enter a description",
  dialogStartDate: "Start Date",
  dialogEndDate: "End Date",
  dialogCancel: "Cancel",
  dialogSaveChanges: "Save Changes",
  dialogCreateEvent: "Create Event",
  toastEventUpdated: "Event updated successfully",
  toastEventCreated: "Event created successfully",
  toastEventEditFailed: "Failed to edit event",
  toastEventAddFailed: "Failed to add event",
  toastEventMoved: "Event updated successfully",
  toastEventMoveFailed: "Failed to update event",
  dialogDeleteButton: "Delete",
  dialogDeleteTitle: "Are you absolutely sure?",
  dialogDeleteDescription:
    "This action cannot be undone. This will permanently delete your event and remove event data from our servers.",
  dialogDeleteCancel: "Cancel",
  dialogDeleteContinue: "Continue",
  toastEventDeleted: "Event deleted successfully.",
  toastEventDeleteError: "Error deleting event.",
  dialogResponsible: "Responsible",
  dialogAt: "at",
  dialogDescriptionLabel: "Description",
  dialogEditButton: "Edit",
  dialogDeleteEventButton: "Delete",
  dialogMore: "more...",
  eventsOn: (date) =>
    `Events on ${new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)}`,
  dialogNoEvents: "No events for this date.",
  settingsLabel: "Calendar settings",
  settingsDotBadge: "Use dot badge",
  settings24h: "Use 24 hour format",
  settingsDaysStartAt: "Days start at",
  settingsH: "h",
  settingsAgendaGroupBy: "Agenda view group by",
  settingsGroupByDate: "Date",
  settingsGroupByColor: "Color",
  agendaSearchPlaceholder: "Type a command or search...",
  agendaNoResults: "No results found.",
  agendaAt: "at",
  weekViewMobileWarning: "Weekly view is not recommended on smaller devices.",
  weekViewMobileSuggestion:
    "Please switch to a desktop device or use the daily view instead.",
  dayHappeningNow: "Happening now",
  dayNoAppointments: "No appointments or consultations at the moment",
  eventDayOfBadge: (currentDay, totalDays) => `Day ${currentDay} of ${totalDays}`,
  filterEventsLabel: "Filter events",
  settingsTrigger: "Calendar settings",
  previous: "Previous",
  next: "Next",
  today: "Today",
};
