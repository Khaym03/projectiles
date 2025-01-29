export default function BtnGame({children}: {children: React.ReactNode}) {
  return (
    <button className="text-lg p-2 px-8 bg-black border-3 border-yellow-500 rounded-em text-white font-bold transition duration-400 shadow-yellow-500 -shadow-[-5px_5px_0px_0px]">
      {children}
    </button>
  )
}
