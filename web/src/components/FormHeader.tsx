interface FormHeaderProps {
    headerText: string;
}

export default function FormHeader({ headerText }: FormHeaderProps) {
    return (
        <h1 className="text-xl font-bold tracking-tight text-gray-900">
            {headerText}
        </h1>
    );
}
