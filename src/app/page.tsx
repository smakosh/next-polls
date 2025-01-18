import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex h-screen flex-col justify-center">
      <div className="container mx-auto grid items-center gap-4 self-center px-4 text-center md:px-6 lg:gap-10">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Welcome to Voxly
          </h1>
          <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Get started by creating your first poll vote!
          </p>
          <Image
            src="/logo.jpg"
            alt="Voxly"
            width={400}
            height={400}
            className="mx-auto rounded-sm object-contain"
          />
        </div>
        <div className="flex flex-col justify-center gap-2 min-[400px]:flex-row">
          <Button size="lg" asChild>
            <Link href="/signup">Sign up</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
