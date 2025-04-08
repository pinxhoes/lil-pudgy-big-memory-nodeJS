import Image from 'next/image'

export default function Spinner() {
    return (
        <div className="flex flex-col items-center mt-8 text-[#00142d]">
            <Image
                src="/img/pinguLogo.svg"
                alt="Loading"
                width={48}
                height={48}
                className="animate-spin"
            />
        </div>
    )
}