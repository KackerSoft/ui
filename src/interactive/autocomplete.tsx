import { Drawer, DrawerContent, DrawerTrigger } from "@/drawer";
import Input from "./Input";
import { useEffect, useState } from "react";
import { cn } from "@/helpers";

export interface AutoCompleteProps<T extends string> {
  options: T[];
  placeholder?: string;
  freeInput?: boolean;
  value: T | null;
  onChange: (value: T | null) => void;
  onSearch?: (search: string) => void;
  containerClassName?: string;
}

export default function AutoComplete<T extends string>(
  props: AutoCompleteProps<T>,
) {
  const {
    options,
    placeholder,
    freeInput = false,
    value,
    onChange,
    onSearch,
    containerClassName,
  } = props;
  const [search, setSearch] = useState("");

  return (
    <Drawer>
      <DrawerTrigger>
        <Input
          placeholder={placeholder}
          value={value || ""}
          outerClassName={cn(containerClassName)}
        />
      </DrawerTrigger>
      <DrawerContent>
        <div className="px-4">
          <Input
            placeholder={placeholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              onSearch?.(e.target.value);
              if (freeInput) {
                onChange(e.target.value as T);
              }
            }}
          />
          {options.map((option) => (
            <button key={option}>{option}</button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
