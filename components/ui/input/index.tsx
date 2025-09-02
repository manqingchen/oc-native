// 'use client';
// import React from 'react';
// import { createInput } from '@gluestack-ui/input';
// import { View, Pressable, TextInput } from 'react-native';
// import { tva } from '@gluestack-ui/nativewind-utils/tva';
// import {
//   withStyleContext,
//   useStyleContext,
// } from '@gluestack-ui/nativewind-utils/withStyleContext';
// import { cssInterop } from 'nativewind';
// import type { VariantProps } from '@gluestack-ui/nativewind-utils';
// import { PrimitiveIcon, UIIcon } from '@gluestack-ui/icon';

// const SCOPE = 'INPUT';

// const UIInput = createInput({
//   Root: withStyleContext(View, SCOPE),
//   Icon: UIIcon,
//   Slot: Pressable,
//   Input: TextInput,
// });

// cssInterop(PrimitiveIcon, {
//   className: {
//     target: 'style',
//     nativeStyleToProp: {
//       height: true,
//       width: true,
//       fill: true,
//       color: 'classNameColor',
//       stroke: true,
//     },
//   },
// });

// const inputStyle = tva({
//   base: 'border-background-300 flex-row overflow-hidden content-center data-[hover=true]:border-outline-400 data-[focus=true]:border-primary-700 data-[focus=true]:hover:border-primary-700 data-[disabled=true]:opacity-40 data-[disabled=true]:hover:border-background-300 items-center',

//   variants: {
//     size: {
//       xl: 'h-12',
//       lg: 'h-11',
//       md: 'h-10',
//       sm: 'h-9',
//     },

//     variant: {
//       underlined:
//         'rounded-none border-b data-[invalid=true]:border-b-2 data-[invalid=true]:border-error-700 data-[invalid=true]:hover:border-error-700 data-[invalid=true]:data-[focus=true]:border-error-700 data-[invalid=true]:data-[focus=true]:hover:border-error-700 data-[invalid=true]:data-[disabled=true]:hover:border-error-700',

//       outline:
//         'rounded border data-[invalid=true]:border-error-700 data-[invalid=true]:hover:border-error-700 data-[invalid=true]:data-[focus=true]:border-error-700 data-[invalid=true]:data-[focus=true]:hover:border-error-700 data-[invalid=true]:data-[disabled=true]:hover:border-error-700 data-[focus=true]:web:ring-1 data-[focus=true]:web:ring-inset data-[focus=true]:web:ring-indicator-primary data-[invalid=true]:web:ring-1 data-[invalid=true]:web:ring-inset data-[invalid=true]:web:ring-indicator-error data-[invalid=true]:data-[focus=true]:hover:web:ring-1 data-[invalid=true]:data-[focus=true]:hover:web:ring-inset data-[invalid=true]:data-[focus=true]:hover:web:ring-indicator-error data-[invalid=true]:data-[disabled=true]:hover:web:ring-1 data-[invalid=true]:data-[disabled=true]:hover:web:ring-inset data-[invalid=true]:data-[disabled=true]:hover:web:ring-indicator-error',

//       rounded:
//         'rounded-full border data-[invalid=true]:border-error-700 data-[invalid=true]:hover:border-error-700 data-[invalid=true]:data-[focus=true]:border-error-700 data-[invalid=true]:data-[focus=true]:hover:border-error-700 data-[invalid=true]:data-[disabled=true]:hover:border-error-700 data-[focus=true]:web:ring-1 data-[focus=true]:web:ring-inset data-[focus=true]:web:ring-indicator-primary data-[invalid=true]:web:ring-1 data-[invalid=true]:web:ring-inset data-[invalid=true]:web:ring-indicator-error data-[invalid=true]:data-[focus=true]:hover:web:ring-1 data-[invalid=true]:data-[focus=true]:hover:web:ring-inset data-[invalid=true]:data-[focus=true]:hover:web:ring-indicator-error data-[invalid=true]:data-[disabled=true]:hover:web:ring-1 data-[invalid=true]:data-[disabled=true]:hover:web:ring-inset data-[invalid=true]:data-[disabled=true]:hover:web:ring-indicator-error',
//     },
//   },
// });

// const inputIconStyle = tva({
//   base: 'justify-center items-center text-typography-400 fill-none',
//   parentVariants: {
//     size: {
//       '2xs': 'h-3 w-3',
//       'xs': 'h-3.5 w-3.5',
//       'sm': 'h-4 w-4',
//       'md': 'h-[18px] w-[18px]',
//       'lg': 'h-5 w-5',
//       'xl': 'h-6 w-6',
//     },
//   },
// });

// const inputSlotStyle = tva({
//   base: 'justify-center items-center web:disabled:cursor-not-allowed',
// });

// const inputFieldStyle = tva({
//   base: 'flex-1 text-typography-900 py-0 px-3 placeholder:text-typography-500 h-full ios:leading-[0px] web:cursor-text web:data-[disabled=true]:cursor-not-allowed',

//   parentVariants: {
//     variant: {
//       underlined: 'web:outline-0 web:outline-none px-0',
//       outline: 'web:outline-0 web:outline-none',
//       rounded: 'web:outline-0 web:outline-none px-4',
//     },

//     size: {
//       '2xs': 'text-2xs',
//       'xs': 'text-xs',
//       'sm': 'text-sm',
//       'md': 'text-base',
//       'lg': 'text-lg',
//       'xl': 'text-xl',
//       '2xl': 'text-2xl',
//       '3xl': 'text-3xl',
//       '4xl': 'text-4xl',
//       '5xl': 'text-5xl',
//       '6xl': 'text-6xl',
//     },
//   },
// });

// type IInputProps = React.ComponentProps<typeof UIInput> &
//   VariantProps<typeof inputStyle> & { className?: string };
// const Input = React.forwardRef<React.ComponentRef<typeof UIInput>, IInputProps>(
//   function Input(
//     { className, variant = 'outline', size = 'md', ...props },
//     ref
//   ) {
//     return (
//       <UIInput
//         ref={ref}
//         {...props}
//         className={inputStyle({ variant, size, class: className })}
//         context={{ variant, size }}
//       />
//     );
//   }
// );

// type IInputIconProps = React.ComponentProps<typeof UIInput.Icon> &
//   VariantProps<typeof inputIconStyle> & {
//     className?: string;
//     height?: number;
//     width?: number;
//   };

// const InputIcon = React.forwardRef<
//   React.ComponentRef<typeof UIInput.Icon>,
//   IInputIconProps
// >(function InputIcon({ className, size, ...props }, ref) {
//   const { size: parentSize } = useStyleContext(SCOPE);

//   if (typeof size === 'number') {
//     return (
//       <UIInput.Icon
//         ref={ref}
//         {...props}
//         className={inputIconStyle({ class: className })}
//         size={size}
//       />
//     );
//   } else if (
//     (props.height !== undefined || props.width !== undefined) &&
//     size === undefined
//   ) {
//     return (
//       <UIInput.Icon
//         ref={ref}
//         {...props}
//         className={inputIconStyle({ class: className })}
//       />
//     );
//   }
//   return (
//     <UIInput.Icon
//       ref={ref}
//       {...props}
//       className={inputIconStyle({
//         parentVariants: {
//           size: parentSize,
//         },
//         class: className,
//       })}
//     />
//   );
// });

// type IInputSlotProps = React.ComponentProps<typeof UIInput.Slot> &
//   VariantProps<typeof inputSlotStyle> & { className?: string };

// const InputSlot = React.forwardRef<
//   React.ComponentRef<typeof UIInput.Slot>,
//   IInputSlotProps
// >(function InputSlot({ className, ...props }, ref) {
//   return (
//     <UIInput.Slot
//       ref={ref}
//       {...props}
//       className={inputSlotStyle({
//         class: className,
//       })}
//     />
//   );
// });

// type IInputFieldProps = React.ComponentProps<typeof UIInput.Input> &
//   VariantProps<typeof inputFieldStyle> & { className?: string };

// const InputField = React.forwardRef<
//   React.ComponentRef<typeof UIInput.Input>,
//   IInputFieldProps
// >(function InputField({ className, ...props }, ref) {
//   const { variant: parentVariant, size: parentSize } = useStyleContext(SCOPE);

//   return (
//     <UIInput.Input
//       ref={ref}
//       {...props}
//       className={inputFieldStyle({
//         parentVariants: {
//           variant: parentVariant,
//           size: parentSize,
//         },
//         class: className,
//       })}
//     />
//   );
// });

// Input.displayName = 'Input';
// InputIcon.displayName = 'InputIcon';
// InputSlot.displayName = 'InputSlot';
// InputField.displayName = 'InputField';

// export { Input, InputField, InputIcon, InputSlot };
import { twClassnames } from "@/utils";
import { TextInput } from "react-native";

export function Input({
  value,
  onChangeText,
  placeholder,
  className,
  type = "number"
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  className?: string;
  type?: "number" | "address";
}) {
  const handleChange = (text: string) => {
    if (type === "number") {
      // 只能输入数字，最多只能有一个小数点，不能是负数
      let filtered = text.replace(/[^\d.]/g, ""); // 只保留数字和小数点
      // 只允许出现一个小数点
      const firstDot = filtered.indexOf(".");
      if (firstDot !== -1) {
        filtered =
          filtered.slice(0, firstDot + 1) +
          filtered.slice(firstDot + 1).replace(/\./g, "");
      }
      // 不能以小数点开头
      if (filtered.startsWith(".")) {
        filtered = "0" + filtered;
      }
      // 不能为负数（已经去除了负号）
      // 不能有多余的前导零（如"00.1"->"0.1"，"01"->"1"）
      if (
        filtered.startsWith("0") &&
        filtered.length > 1 &&
        filtered[1] !== "."
      ) {
        filtered = filtered.replace(/^0+/, "");
        if (filtered === "") filtered = "0";
      }
      text = filtered;
    }
    if (type === "address") {
      // 支持英文和数字
      text = text.replace(/[^a-zA-Z0-9]/g, "");
    }
    onChangeText(text);
  };

  return (
    <TextInput
      className={twClassnames("text-xl font-bold flex-1 bg-transparent outline-none", className)}
      style={{ minWidth: 80, color: "black", minHeight: 50 }}
      value={value}
      onChangeText={handleChange}
      placeholder={placeholder}
      keyboardType="numeric"
      placeholderTextColor="#888"
    />
  );
}