import { twMerge } from "tailwind-merge";

export type LoginWithKackerProps = Omit<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & {
    loading?: boolean;
    text?: string;
  },
  "children"
>;

export default function LoginWithKacker(
  props: LoginWithKackerProps,
): React.JSX.Element {
  const { loading, className, text = "Login with Kacker", ...rest } = props;

  return (
    <button
      {...rest}
      className={twMerge(
        "text-purple-500 rounded-lg bg-purple-500/10 px-6 py-3 flex items-center justify-between ripple",
        className,
      )}
    >
      <div className="flex items-center">
        <img
          src="https://auth.writeroo.net/kacker_w.svg"
          alt="Kacker"
          className="w-9 mr-2 p-2"
        />
        {text}
      </div>
      {loading ? (
        <i className="far fa-spinner-third animate-spin" />
      ) : (
        <i className="fal fa-arrow-right ml-3" />
      )}
    </button>
  );
}
