interface UserProfileSliderItemInterface {
    itemText: string
    styles?: string
}

export default function UserProfileSliderItem({itemText, styles}: UserProfileSliderItemInterface) {
    return (
        <div className={`w-full flex justify-center text-sm items-center py-2 bg-sky-100 font-mono font-bold lg:py-3 lg:text-lg ${styles}`}>
            {itemText}
        </div>
    )   
}