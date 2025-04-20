interface FormHeaderProps {
    headerText: string;
}

export default function FormHeader({ headerText }: FormHeaderProps) {
    return (
        <h1 className="text-3xl font-extrabold tracking-tight text-indigo-800">
            {headerText}
        </h1>
    );
}
