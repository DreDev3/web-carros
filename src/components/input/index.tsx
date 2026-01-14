import type { RegisterOptions, UseFormRegister } from "react-hook-form";

interface InputProps {
  name: string;
  placeholder: string;
  type: string;
  register: UseFormRegister<any>;
  error?: string;
  rules?: RegisterOptions;
}

export default function Input({ name, placeholder, type, register, rules, error }: InputProps) {
  return (
    <div>
      <input
        className="w-full border-b-2 border-gray-200 h-11 px-2 outline-none focus:border-y-zinc-900"
        type={type}
        placeholder={placeholder}
        {...register(name, rules)}
        id={name}
      />
      {error && <p className="font-medium text-sm my-1 text-red-600">{error}</p>}
    </div>
  )
}