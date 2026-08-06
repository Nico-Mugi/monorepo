import { areIntervalsOverlapping, parseISO } from "date-fns";
import type { DragEvent } from "react";
import { useDragDrop } from "../../contexts/dnd-context";
import { getEventBlockStyle, HOUR_HEIGHT_PX } from "../../helpers";
import type { IEvent } from "../../interfaces";
import { EventBlock } from "./event-block";

interface RenderGroupedEventsProps {
  groupedEvents: IEvent[][];
  day: Date;
}

export function RenderGroupedEvents({
  groupedEvents,
  day,
}: RenderGroupedEventsProps) {
  const { handleEventDrop } = useDragDrop();

  // Event blocks are absolutely positioned on top of the hour/half-hour
  // DroppableArea slots underneath them (not nested inside one), so
  // dragging onto a spot already covered by another event's rendered block
  // — a very normal thing to do — never reached a droppable target at all;
  // the browser silently refuses the drop since nothing under the pointer
  // ever called preventDefault() on dragover. Each block needs its own
  // drop handling, snapping to the same half-hour granularity
  // DroppableArea uses, computed from where within the day column the
  // event was actually dropped.
  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const column = e.currentTarget.parentElement;
    if (!column) return;

    const rect = column.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const totalMinutes = (offsetY / HOUR_HEIGHT_PX) * 60;
    const hour = Math.min(23, Math.max(0, Math.floor(totalMinutes / 60)));
    const minute = totalMinutes % 60 < 30 ? 0 : 30;

    handleEventDrop(day, hour, minute);
  };

  return groupedEvents.map((group, groupIndex) =>
    group.map((event) => {
      let style = getEventBlockStyle(
        event,
        day,
        groupIndex,
        groupedEvents.length,
      );
      const hasOverlap = groupedEvents.some(
        (otherGroup, otherIndex) =>
          otherIndex !== groupIndex &&
          otherGroup.some((otherEvent) =>
            areIntervalsOverlapping(
              {
                start: parseISO(event.startDate),
                end: parseISO(event.endDate),
              },
              {
                start: parseISO(otherEvent.startDate),
                end: parseISO(otherEvent.endDate),
              },
            ),
          ),
      );

      if (!hasOverlap) style = { ...style, width: "100%", left: "0%" };

      return (
        <div
          key={event.id}
          className="absolute p-1"
          style={style}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <EventBlock event={event} />
        </div>
      );
    }),
  );
}
