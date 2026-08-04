interface EduEntryProps {
  degree: string;
  school: string;
  period: string;
  location?: string;
}

export const EduEntry = ({
  degree,
  school,
  period,
  location,
}: EduEntryProps) => (
  <div className="flex justify-between items-start gap-2">
    <div>
      <p className="font-[Raleway,sans-serif] font-bold text-[13px] text-gray-900 m-0">
        {degree}
      </p>
      <p className="font-[Lato,sans-serif] text-[12px] text-gray-500 mt-0.5 mb-0">
        {school}
      </p>
    </div>
    <div className="flex flex-col items-end">
      <p className="font-[Lato,sans-serif] text-[11px] text-gray-400 italic whitespace-nowrap shrink-0">
        {period}
      </p>
      {location && (
        <p className="font-[Lato,sans-serif] text-[11px] text-gray-400 italic whitespace-nowrap shrink-0 mt-0.5">
          {location}
        </p>
      )}
    </div>
  </div>
);
