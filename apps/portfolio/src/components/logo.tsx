export function Logo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 20">
      <text
        y="100%"
        className="fill-foreground"
        fontFamily="Inter, sans-serif"
        fontWeight={700}
        fontSize={25}
        letterSpacing={"-0.025em"}
      >
        NT
        <tspan className="fill-primary">.DEV</tspan>
      </text>
    </svg>
  );
}

export function LogoVertical() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40">
      <text
        x="6.333333"
        y="50%"
        className="fill-foreground"
        fontFamily="Inter, sans-serif"
        fontWeight={700}
        fontSize={25}
        letterSpacing={"-0.025em"}
      >
        NT
      </text>
      <text
        dy="100%"
        className="fill-primary"
        fontFamily="Inter, sans-serif"
        fontWeight={700}
        fontSize={25}
        letterSpacing={"-0.025em"}
      >
        .DEV
      </text>
    </svg>
  );
}
