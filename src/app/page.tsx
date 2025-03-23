import QnA from "@/components/ui/deep-research/QnA";
import UserInput from "@/components/ui/deep-research/UserInput";
import Image from "next/image";
import bg from "../../public/background.jpg"

export default function Home() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-start gap-12 py-20 px-4 bg-white relative">

      {/* Background Image Overlay */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 bg-black/40">
        <Image
          src={bg}
          alt="DeepSearch AI Agent"
          className="w-full h-full object-cover opacity-40"
        />
      </div>

      {/* Title + Description */}
      <div className="flex flex-col items-center gap-4 text-center max-w-3xl">
        <h1 className="text-5xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 drop-shadow">
          DeepSearch
        </h1>
        <p className="text-gray-800 text-lg sm:text-xl leading-relaxed text-balance">
          Enter a topic and answer a few guided questions to generate a
          comprehensive, AI-assisted research report tailored to your needs.
        </p>
      </div>

      {/* Components */}
      <UserInput />
      <QnA />
    </main>
  );
}
