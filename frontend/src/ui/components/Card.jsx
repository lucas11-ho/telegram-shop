export function Card({ className = "", ...props }) {
  return (
    <div
      className={
        "rounded-2xl border border-[#1F2A37] bg-[#101826] shadow-[0_1px_0_rgba(255,255,255,0.04)] " +
        className
      }
      {...props}
    />
  );
}

export function CardHeader({ className = "", ...props }) {
  return <div className={"px-5 pt-5 " + className} {...props} />;
}

export function CardBody({ className = "", ...props }) {
  return <div className={"px-5 pb-5 " + className} {...props} />;
}
