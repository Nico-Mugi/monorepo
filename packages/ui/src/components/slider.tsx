import { Slider as SliderPrimitive } from "@base-ui/react/slider"

import { cn } from "../utils/cn"

function Slider({
  className,
  "aria-label": ariaLabel,
  ...props
}: SliderPrimitive.Root.Props<number> & { "aria-label"?: string }) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      thumbAlignment="edge"
      className={cn(
        "data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-40 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-full bg-input/90 select-none data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="bg-primary select-none data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          getAriaLabel={ariaLabel ? () => ariaLabel : undefined}
          className="block h-4 w-6 shrink-0 rounded-full bg-background shadow-md ring-1 ring-border transition-[color,box-shadow,background-color] select-none not-dark:bg-clip-padding hover:ring-4 hover:ring-ring/30 focus-visible:ring-4 focus-visible:ring-ring/30 focus-visible:outline-hidden data-disabled:pointer-events-none data-disabled:opacity-50 data-[orientation=vertical]:h-6 data-[orientation=vertical]:w-4"
        />
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
