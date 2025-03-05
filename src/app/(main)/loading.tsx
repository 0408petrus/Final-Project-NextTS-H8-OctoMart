import '../globals.css'

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="text-center">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32 mb-4 mx-auto"></div>
        <h2 className="text-xl font-semibold text-white text-center">Loading...</h2>
        <p className="text-gray-400 text-center">Please wait a moment</p>
      </div>
    </div>
  )
}