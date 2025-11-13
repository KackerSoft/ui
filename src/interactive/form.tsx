import { useEffect, useRef, useState } from "react";

type Errors<T> = { all?: string } & {
  [K in keyof T]?: string;
};

export interface FormProps<T extends Object> {
  onSubmit: (data: T) => void;
  initialData: T;
  validate?: (data: T) => boolean;
  children: (p: {
    errors: Errors<T>;
    data: T;
    setData: (data: T) => void;
    setField: <K extends keyof T>(field: K, value: T[K]) => void;
    submit: () => void;
  }) => React.ReactNode;
}

export default function Form<T extends Object>(props: FormProps<T>) {
  const [errors, setErrors] = useState<Errors<T>>({});
  const [form, setForm] = useState<T>(props.initialData);

  const setField = <K extends keyof T>(field: K, value: T[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const formRef = useRef<HTMLFormElement>(null);

  const submit = async () => {
    setErrors({});
    try {
      await props.validate?.(form);
    } catch (error) {
      setErrors(error as Errors<T>);
      return;
    }
    try {
      await props.onSubmit(form);
    } catch (error) {
      setErrors(error as Errors<T>);
      return;
    }
    // clear form
    formRef.current?.reset();
  };

  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex flex-col gap-2"
    >
      {props.children({
        errors,
        data: form,
        setData: setForm,
        setField,
        submit,
      })}
    </form>
  );
}
