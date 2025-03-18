import { LoaderProps } from "./types"

const Loader = ({ content }: LoaderProps) => {
  return (
    <div className="flex items-center gap-2">
        <img src="/icons/loader.webp" alt="loader" className="w-6 h-6"/>
        <span>{ content }</span>
    </div>
  )
}

export default Loader