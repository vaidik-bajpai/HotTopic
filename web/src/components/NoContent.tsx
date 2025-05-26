import { NoContentInterface } from "../types/NoContent"

const NoContent = ({image, title, text}: NoContentInterface) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center justify-center text-center max-w-md mx-auto">
      {image}
      <h3 className="text-lg font-semibold text-indigo-700 mb-2">{title}</h3>
      <p className="text-indigo-600 text-sm mb-4">
          {text}
      </p>
  </div>
  )
}

export default NoContent  