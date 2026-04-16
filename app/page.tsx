"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Sparkles, PlusCircle, Rocket } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const createNewList = async (isPredefined = false) => {
    if (status !== "authenticated") {
      router.push("/login");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch("/api/list/create", {
        method: "POST",
        body: JSON.stringify({ 
          name: isPredefined ? "Unsere Abenteuer" : "Meine Liste",
          predefined: isPredefined 
        }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      router.push(`/list/${data.id}`);
    } catch (e) {
      console.error(e);
      alert("Fehler beim Erstellen der Liste. Bitte melde dich an.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-2xl"
      >
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-accent-primary/10 rounded-2xl ring-1 ring-accent-primary/20">
            <Sparkles className="w-10 h-10 text-accent-primary" />
          </div>
        </div>
        <h1 className="text-6xl md:text-8xl font-extrabold mb-6 tracking-tighter text-foreground">
          Bucket <span className="text-accent-primary">List</span>
        </h1>
        <p className="text-gray-600 text-lg mb-12 max-w-md mx-auto font-light">
          Halte eure Träume fest, plant eure Abenteuer und hake gemeinsam eure Highlights ab.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => createNewList(false)}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary/90 transition-all disabled:opacity-50 shadow-sm hover:shadow-md"
          >
            <PlusCircle className="w-5 h-5" />
            Neue Liste
          </motion.button>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => createNewList(true)}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary/90 transition-all disabled:opacity-50 shadow-sm hover:shadow-md"
          >
            <Rocket className="w-5 h-5" />
            Vorlage laden
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
