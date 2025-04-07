interface FormSubHeaderProps {
    subHeaderText: string;
}

export default function FormSubHeader({ subHeaderText }: FormSubHeaderProps) {
    return (
        <p className="text-sm font-medium text-gray-600">
            {subHeaderText}
        </p>
    );
}
