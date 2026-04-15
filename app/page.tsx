"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, PlusCircle, Rocket } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const createNewList = async (isPredefined = false) => {
    setLoading(true);
    try {
      const res = await fetch("/api/list/create", {
        method: "POST",
        body: JSON.stringify({ 
          name: isPredefined ? "Unsere Abenteuer" : "Meine Liste",
          predefined: isPredefined 
        }),
      });
      const data = await res.json();
      router.push(`/list/${data.id}`);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-accent-primary/20 rounded-full ring-2 ring-accent-primary/50">
            <Sparkles className="w-12 h-12 text-accent-primary" />
          </div>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-glow">
          Bucket <span className="text-accent-primary">List</span>
        </h1>
        <p className="text-gray-400 text-lg mb-12 max-w-md mx-auto">
          Halte eure Träume fest, plant eure Abenteuer und hake gemeinsam eure Highlights ab.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => createNewList(false)}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-2xl transition-all hover:bg-gray-200 disabled:opacity-50"
          >
            <PlusCircle className="w-5 h-5" />
            Neue Liste erstellen
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => createNewList(true)}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary text-white font-bold rounded-2xl transition-all hover:bg-blue-600 shadow-lg shadow-accent-primary/30 disabled:opacity-50"
          >
            <Rocket className="w-5 h-5" />
            Meine Vorlage laden
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
