import { useEffect, useRef, useState } from "react";

type Errors<T> = { all?: string } & {
  [K in keyof T]?: string;
};

export interface FormProps<T extends Object> {
  onSubmit: (data: T) => void;
  initialData: T;
  validate?: (data: T) => boolean;
  children: (p: { errors: Errors<T> }) => React.ReactNode;
}

export default function Form<T extends Object>(props: FormProps<T>) {
  const [errors, setErrors] = useState<Errors<T>>({});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // set form fields to initial data
    if (formRef.current) {
      const form = formRef.current;
      let traversed: string[] = [];
      Object.entries(props.initialData).forEach(([key, value]) => {
        const input = form.elements.namedItem(key) as HTMLInputElement;
        if (input) {
          traversed.push(key);
          input.value = value as string;
        }
      });
    }
  }, [props.initialData]);

  return (
    <form
      ref={formRef}
      onSubmit={async (e) => {
        e.preventDefault();
        setErrors({});
        const formData = new FormData(e.target as HTMLFormElement);
        const data: T = { ...props.initialData };
        formData.forEach((value, key) => {
          (data as any)[key] = value;
        });
        try {
          await props.validate?.(data);
        } catch (error) {
          setErrors(error as Errors<T>);
          return;
        }
        try {
          await props.onSubmit(data);
        } catch (error) {
          setErrors(error as Errors<T>);
          return;
        }
        // clear form
        (e.target as HTMLFormElement).reset();
      }}
      className="flex flex-col gap-2"
    >
      {props.children({ errors })}
    </form>
  );
}
