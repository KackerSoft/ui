import { twMerge } from "tailwind-merge";
import { SwitchOption } from "./Switch";
import { useRef, useState } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/drawer";
import { cn } from "@/helpers";
import Input from "./Input";

export type SelectProps<T extends string> = {
  value?: T;
  onChange?: (value: T) => void;
  options: SwitchOption<T>[];
  className?: string;
  placeholder?: string;
  error?: string;
};

export default function Select<T extends string>(props: SelectProps<T>) {
  const { value, onChange, options, className, placeholder, error } = props;

  const valueOption: SwitchOption | undefined = options.find(
    (option) => option.value === value,
  );

  const [search, setSearch] = useState("");
  const searchOptions = options.filter((option) =>
    option.label
      ?.toString()
      .toLowerCase()
      .includes(search.toLowerCase().trim()),
  );
  return (
    <>
      <Drawer>
        {(open, setOpen) => (
          <>
            <div className="w-full">
              <DrawerTrigger>
                <button
                  className={twMerge(
                    "flex justify-between items-center gap-2 bg-primary-800/50 border-2 border-secondary-950/5 rounded-xl ripple pl-3 py-2.75 w-full relative",
                    !!valueOption && "pt-4 pb-1.5",
                    className,
                  )}
                  type={"button"}
                >
                  {!!placeholder && (
                    <div
                      className={twMerge(
                        "absolute top-2.75 flex items-center justify-center left-3 opacity-60 transition-all",
                        !!valueOption && "top-1.5 text-[10px]",
                        open && "opacity-100 text-accent-500 font-semibold",
                      )}
                    >
                      {placeholder}
                    </div>
                  )}
                  <div
                    className={cn(
                      "opacity-0 invisible transition-all",
                      valueOption?.label && "opacity-100 visible",
                    )}
                  >
                    {valueOption?.label || "Select an option"}
                  </div>
                  <div className="text-gray-500 py-2 px-3 flex items-center justify-center absolute top-0 right-0 h-full">
                    <i className="far fa-chevron-down" />
                  </div>
                </button>
              </DrawerTrigger>
              {error && (
                <div className="text-red-500 text-sm mt-1">{error}</div>
              )}
            </div>

            <DrawerContent
              title={
                <div>
                  <div>{placeholder || "Select an option"}</div>
                  {options.length >= 10 && (
                    <Input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search..."
                      className="w-full"
                      outerClassName="mt-4 text-base font-normal"
                      left={<i className="far fa-search" />}
                    />
                  )}
                </div>
              }
            >
              <div className="flex flex-col gap-2 px-4">
                {searchOptions.map((option, index) => (
                  <button
                    type={"button"}
                    key={index}
                    className={cn(
                      `w-full flex items-center justify-between text-left px-2 py-1 rounded-xl ripple`,
                      option.value === value && "text-accent-500",
                    )}
                    onClick={() => {
                      onChange?.(option.value);
                      setOpen(false);
                    }}
                  >
                    <div>{option.label}</div>
                    {option.value === value && <i className="far fa-check" />}
                  </button>
                ))}
              </div>
            </DrawerContent>
          </>
        )}
      </Drawer>
    </>
  );
}
