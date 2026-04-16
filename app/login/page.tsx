"use client";
export const dynamic = "force-dynamic";
import { signIn, signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { LogIn, LogOut, User, Rocket, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Willkommen zurück, {session.user?.name}!</h1>
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary/90 transition-all"
          >
            Zu meinen Listen
          </button>
          <button 
            onClick={() => signOut()}
            className="px-8 py-4 bg-gray-100 text-foreground font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
          >
            Abmelden
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 max-w-md w-full flex flex-col items-center"
      >
        <div className="p-4 bg-accent-primary/10 rounded-full mb-6">
          <User className="w-12 h-12 text-accent-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4 tracking-tight text-foreground">Login</h1>
        <p className="text-gray-600 mb-12 font-light">
          Melde dich an, um deine eigenen Bucket Lists zu speichern und zu verwalten.
        </p>
        <button 
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary/90 transition-all shadow-sm hover:shadow-md"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
          Mit Google anmelden
        </button>
      </motion.div>
    </div>
  );
}
