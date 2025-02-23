interface FormHeaderInterface {
    headerText: string
}

export default function FormHeader({headerText}: FormHeaderInterface) {
    return (
        <h1 className="font-bold text-xl">
            {headerText}
        </h1>
    )
}