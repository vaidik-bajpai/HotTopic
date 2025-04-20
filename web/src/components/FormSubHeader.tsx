interface FormSubHeaderProps {
    subHeaderText: string;
}

export default function FormSubHeader({ subHeaderText }: FormSubHeaderProps) {
    return (
        <p className="text-base font-medium text-gray-700 leading-snug">
            {subHeaderText}
        </p>
    );
}
