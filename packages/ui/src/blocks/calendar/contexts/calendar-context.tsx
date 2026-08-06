import type { Locale } from "date-fns";
import type React from "react";
import { createContext, useContext, useState } from "react";
import { useLocalStorage } from "../hooks";
import type { IEvent, IUser } from "../interfaces";
import { defaultCalendarLabels, type CalendarLabels } from "../labels";
import type { TCalendarView, TEventColor } from "../types";

interface ICalendarContext {
  selectedDate: Date;
  view: TCalendarView;
  setView: (view: TCalendarView) => void;
  agendaModeGroupBy: "date" | "color";
  setAgendaModeGroupBy: (groupBy: "date" | "color") => void;
  use24HourFormat: boolean;
  toggleTimeFormat: () => void;
  startOfDayHour: number;
  setStartOfDayHour: (newVal: number) => void;
  setSelectedDate: (date: Date | undefined) => void;
  selectedUserIds: IUser["id"][];
  badgeVariant: "dot" | "colored";
  setBadgeVariant: (variant: "dot" | "colored") => void;
  selectedColors: TEventColor[];
  filterEventsBySelectedColors: (colors: TEventColor) => void;
  filterEventsBySelectedUsers: (userId: IUser["id"]) => void;
  clearUserFilter: () => void;
  users: IUser[];
  events: IEvent[];
  addEvent: (event: IEvent) => void;
  updateEvent: (event: IEvent) => void;
  removeEvent: (eventId: number) => void;
  clearFilter: () => void;
  labels: CalendarLabels;
  locale?: Locale;
}

interface CalendarSettings {
  badgeVariant: "dot" | "colored";
  view: TCalendarView;
  use24HourFormat: boolean;
  startOfDayHour: number;
  agendaModeGroupBy: "date" | "color";
}

export const MIN_SCROLL_HOUR = 0;
// With a fixed calendar height, having 16h on top
// of the frame allows to see the rest of the day
export const MAX_SCROLL_HOUR = 16;

const DEFAULT_SETTINGS: CalendarSettings = {
  badgeVariant: "colored",
  view: "day",
  use24HourFormat: true,
  startOfDayHour: 8,
  agendaModeGroupBy: "date",
};

const CalendarContext = createContext({} as ICalendarContext);

export function CalendarProvider({
  children,
  users,
  events,
  badge = "colored",
  view = "day",
  labels,
  locale,
}: {
  children: React.ReactNode;
  users: IUser[];
  events: IEvent[];
  view?: TCalendarView;
  badge?: "dot" | "colored";
  labels?: Partial<CalendarLabels>;
  locale?: Locale;
}) {
  const [rawSettings, setSettings] = useLocalStorage<Partial<CalendarSettings>>(
    "calendar-settings",
    {},
  );

  const settings: CalendarSettings = {
    ...DEFAULT_SETTINGS,
    badgeVariant: badge,
    view: view,
    ...rawSettings,
  };

  const [badgeVariant, setBadgeVariantState] = useState<"dot" | "colored">(
    settings.badgeVariant,
  );
  const [currentView, setCurrentViewState] = useState<TCalendarView>(
    settings.view,
  );
  const [use24HourFormat, setUse24HourFormatState] = useState<boolean>(
    settings.use24HourFormat,
  );
  const [startOfDayHour, setStartOfDayHourState] = useState<number>(
    settings.startOfDayHour,
  );
  const [agendaModeGroupBy, setAgendaModeGroupByState] = useState<
    "date" | "color"
  >(settings.agendaModeGroupBy);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedUserIds, setSelectedUserIds] = useState<IUser["id"][]>([]);
  const [selectedColors, setSelectedColors] = useState<TEventColor[]>([]);

  const [allEvents, setAllEvents] = useState<IEvent[]>(events || []);
  const [filteredEvents, setFilteredEvents] = useState<IEvent[]>(events || []);

  const updateSettings = (newPartialSettings: Partial<CalendarSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newPartialSettings,
    }));
  };

  const setBadgeVariant = (variant: "dot" | "colored") => {
    setBadgeVariantState(variant);
    updateSettings({ badgeVariant: variant });
  };

  const setView = (newView: TCalendarView) => {
    setCurrentViewState(newView);
    updateSettings({ view: newView });
  };

  const toggleTimeFormat = () => {
    const newValue = !use24HourFormat;
    setUse24HourFormatState(newValue);
    updateSettings({ use24HourFormat: newValue });
  };

  const setStartOfDayHour = (newVal: number) => {
    if (
      !isNaN(newVal) &&
      newVal >= MIN_SCROLL_HOUR &&
      newVal <= MAX_SCROLL_HOUR
    ) {
      setStartOfDayHourState(newVal);
      updateSettings({ startOfDayHour: newVal });
    }
  };

  const setAgendaModeGroupBy = (groupBy: "date" | "color") => {
    setAgendaModeGroupByState(groupBy);
    updateSettings({ agendaModeGroupBy: groupBy });
  };

  const applyFilters = (colors: TEventColor[], userIds: IUser["id"][]) => {
    let filtered = allEvents;

    if (colors.length > 0) {
      filtered = filtered.filter((event) =>
        colors.includes(event.color || "blue"),
      );
    }

    if (userIds.length > 0) {
      filtered = filtered.filter((event) => userIds.includes(event.user.id));
    }

    setFilteredEvents(filtered);
  };

  const filterEventsBySelectedColors = (color: TEventColor) => {
    const isColorSelected = selectedColors.includes(color);
    const newColors = isColorSelected
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color];

    setSelectedColors(newColors);
    applyFilters(newColors, selectedUserIds);
  };

  const filterEventsBySelectedUsers = (userId: IUser["id"]) => {
    const isUserSelected = selectedUserIds.includes(userId);
    const newUserIds = isUserSelected
      ? selectedUserIds.filter((id) => id !== userId)
      : [...selectedUserIds, userId];

    setSelectedUserIds(newUserIds);
    applyFilters(selectedColors, newUserIds);
  };

  const clearUserFilter = () => {
    setSelectedUserIds([]);
    applyFilters(selectedColors, []);
  };

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
  };

  const addEvent = (event: IEvent) => {
    setAllEvents((prev) => [...prev, event]);
    setFilteredEvents((prev) => [...prev, event]);
  };

  const updateEvent = (event: IEvent) => {
    const updated = {
      ...event,
      startDate: new Date(event.startDate).toISOString(),
      endDate: new Date(event.endDate).toISOString(),
    };

    setAllEvents((prev) => prev.map((e) => (e.id === event.id ? updated : e)));
    setFilteredEvents((prev) =>
      prev.map((e) => (e.id === event.id ? updated : e)),
    );
  };

  const removeEvent = (eventId: number) => {
    setAllEvents((prev) => prev.filter((e) => e.id !== eventId));
    setFilteredEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  const clearFilter = () => {
    setFilteredEvents(allEvents);
    setSelectedColors([]);
    setSelectedUserIds([]);
  };

  const mergedLabels: CalendarLabels = { ...defaultCalendarLabels, ...labels };

  const value: ICalendarContext = {
    selectedDate,
    setSelectedDate: handleSelectDate,
    selectedUserIds,
    badgeVariant,
    setBadgeVariant,
    users,
    selectedColors,
    filterEventsBySelectedColors,
    filterEventsBySelectedUsers,
    clearUserFilter,
    events: filteredEvents,
    view: currentView,
    use24HourFormat,
    toggleTimeFormat,
    startOfDayHour,
    setStartOfDayHour,
    setView,
    agendaModeGroupBy,
    setAgendaModeGroupBy,
    addEvent,
    updateEvent,
    removeEvent,
    clearFilter,
    labels: mergedLabels,
    locale,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar(): ICalendarContext {
  const context = useContext(CalendarContext);
  if (!context)
    throw new Error("useCalendar must be used within a CalendarProvider.");
  return context;
}
