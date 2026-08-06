import { format } from "date-fns";
import { motion } from "framer-motion";
import { Button } from "~/components/shadcn/ui/button";
import { buttonHover, transition } from "~/features/calendar/animations";
import { useCalendar } from "~/features/calendar/contexts/calendar-context";
import { getDateFnsLocale } from "~/lib/date-locale";

const MotionButton = motion.create(Button);

export function TodayButton() {
  const { setSelectedDate } = useCalendar();

  const today = new Date();
  const handleClick = () => setSelectedDate(today);

  return (
    <MotionButton
      variant="outline"
      aria-label="Today"
      data-testid="today-button"
      className="flex h-14 w-14 flex-col items-center justify-center p-0 text-center"
      onClick={handleClick}
      variants={buttonHover}
      whileHover="hover"
      whileTap="tap"
      transition={transition}
    >
      <motion.span
        className="w-full bg-primary py-1 text-xs font-semibold text-primary-foreground"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, ...transition }}
      >
        {format(today, "MMM", { locale: getDateFnsLocale() }).toUpperCase()}
      </motion.span>
      <motion.span
        className="text-lg font-bold"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, ...transition }}
      >
        {format(today, "d", { locale: getDateFnsLocale() })}
      </motion.span>
    </MotionButton>
  );
}
