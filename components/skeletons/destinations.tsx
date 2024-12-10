import { View } from "react-native"
import CustomSkeleton from "../ui/skeleton"

export const DestinationCardSkeleton = () => {
    return (
        <View className='w-72 border border-slate-300/30 dark:border-white/10 rounded-2xl p-2 mr-3'>
            <CustomSkeleton width={"100%"} height={160} radius={12} />

            <View className='mt-2'>
                <CustomSkeleton width={"75%"} height={24} radius={8} />
                <View className='flex-row justify-between items-center pt-2'>
                    <CustomSkeleton width={100} height={16} radius={8} />
                    <CustomSkeleton width={80} height={9} radius={8} />
                </View>
            </View>
        </View>
    )
}
