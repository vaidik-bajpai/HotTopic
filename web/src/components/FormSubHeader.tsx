interface FormSubHeader {
    subHeaderText: string
}

export default function FormSubHeader({subHeaderText}: FormSubHeader) {
    return (
        <div className="text-sm font-medium">
            {subHeaderText}
        </div>
    )
}