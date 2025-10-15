import { twMerge } from "tailwind-merge";
import { SwitchOption } from "./Switch";
import { useState } from "react";
import { Drawer, DrawerTitle } from "@/drawer";

export type SelectProps = {
  value: string | null | number;
  onChange: (value: string | null) => void;
  options: SwitchOption[];
  className?: string;
  title?: React.ReactNode;
};

export default function Select(props: SelectProps) {
  const { value, onChange, options, className, title } = props;

  const [drawer, setDrawer] = useState(false);

  const valueIndex = options.findIndex((option) => option.value === value);
  const valueOption: SwitchOption | undefined = options[valueIndex];

  return (
    <>
      <button
        className={twMerge(
          "flex justify-between gap-2 border border-secondaryActive rounded-lg ripple items-stretch",
          className,
        )}
        onClick={() => setDrawer(true)}
        type={"button"}
      >
        <div className="p-4">{valueOption?.label}</div>
        <div className="text-gray-500 py-2 px-3 flex items-center justify-center">
          <i className="far fa-chevron-down" />
        </div>
      </button>
      <Drawer open={drawer} onOpenChange={setDrawer}>
        <>
          <DrawerTitle>{title}</DrawerTitle>
          <div className="flex flex-col gap-2 p-4">
            {options.map((option, index) => (
              <button
                type={"button"}
                key={index}
                className={`w-full flex items-center justify-between text-left p-2 rounded-lg ripple ${index === valueIndex ? "text-accent-500" : ""}`}
                onClick={() => {
                  onChange(`${option.value}`);
                  setDrawer(false);
                }}
              >
                <div>{option.label}</div>
                {index === valueIndex && <i className="far fa-check" />}
              </button>
            ))}
          </div>
        </>
      </Drawer>
    </>
  );
}
