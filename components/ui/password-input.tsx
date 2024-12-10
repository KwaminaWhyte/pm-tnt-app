import { ReactNode, useState } from "react"
import { Pressable } from "react-native"
import { EyeDuotone, EyeSlashDuotone } from "../icons/auth"
import { Input } from "./input"

export const PasswordInput = ({
    value,
    onChangeText,
    startContent,
    label,
    placeholder,
    errorMessage,
}: {
    value?: string | undefined
    onChangeText?: ((text: string) => void) | undefined
    startContent?: ReactNode | undefined
    label?: string | undefined
    placeholder?: string | undefined
    errorMessage?: string | undefined
}) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <Input
            value={value}
            onChangeText={onChangeText}
            startContent={startContent}
            label={label}
            placeholder={placeholder}
            errorMessage={errorMessage}
            secureTextEntry={!showPassword}
            endContent={
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                        <EyeSlashDuotone className="w-5 h-5 text-slate-500" />
                    ) : (
                        <EyeDuotone className="w-5 h-5 text-slate-500" />
                    )}
                </Pressable>
            }
        />
    )
}
