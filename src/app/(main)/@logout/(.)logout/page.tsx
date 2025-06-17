"use client"
import { Logout } from "@/components/Auth/action";
import { Button } from "@visa/nova-react";
import { useRouter } from "next/navigation";

export default function LogoutInterceptPage() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <section className="w-fit min-w-56 p-6 bg-Color-Surface-surface-1 rounded-lg inline-flex flex-col justify-start items-center gap-8 bg-white">
          <h3 className="justify-start text-Color-Text-text text-2xl font-medium font-['Noto_Sans'] leading-loose">Are you sure you want to log out?</h3>
          <div className="inline-flex justify-center items-start gap-8">
            <Button destructive onClick={Logout}>Yes, log me out</Button>
            <Button colorScheme="tertiary" onClick={() => router.back()}>No, keep me signed in</Button>
          </div>
      </section>
    </div>
  );
}
