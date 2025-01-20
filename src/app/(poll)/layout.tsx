import Link from "next/link";
import { PackageIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/app/(poll)/dashboard/_components/logout-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUser } from "@/app/(auth)/_lib/dal";

const navLinks = [{ title: "Polls", href: "/dashboard", badge: 0 }];

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  const activeLink = "/dashboard";

  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden w-80 border-r lg:block">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4">
            <Link className="flex items-center gap-2 font-semibold" href="/">
              <PackageIcon className="size-6" />
              <span className="">Voxly</span>
            </Link>
          </div>
          {user?.id && (
            <>
              <div className="flex-1 overflow-auto py-2">
                <nav className="grid items-start px-4 text-sm font-medium">
                  {navLinks.map((link) => (
                    <Link
                      className={`${
                        activeLink === link.href
                          ? "bg-gray-100 text-gray-900 hover:text-gray-900"
                          : ""
                      } flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900`}
                      href={link.href}
                      key={link.title}
                    >
                      <span>{link.title}</span>
                      {link.badge > 0 && (
                        <Badge className="ml-auto flex size-6 shrink-0 items-center justify-center rounded-full">
                          {link.badge}
                        </Badge>
                      )}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="border-t p-4">
                <LogoutButton />
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex w-full flex-col">
        <header className="flex h-14 items-center border-b px-4 md:gap-4">
          <Link
            className="flex items-center rounded-md bg-gray-100 p-2 lg:hidden"
            href="#"
          >
            <PackageIcon className="size-6" />
            <span className="sr-only">Home</span>
          </Link>
          <h1 className="md:blobk hidden text-lg font-semibold">Dashboard</h1>
          {user?.id && (
            <div className="ml-auto flex items-center gap-4">
              <Button className="rounded-full" size="icon" variant="ghost">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback>
                    {user?.name.split(" ")[0][0]}
                    {user?.name.split(" ")[1][0]}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </div>
          )}
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
