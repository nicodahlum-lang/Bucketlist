"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, LogOut, LayoutDashboard, Rocket } from "lucide-react";

interface UserList {
  id: string;
  name: string;
  created_at: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [lists, setLists] = useState<UserList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      async function fetchLists() {
        const res = await fetch("/api/user/lists");
        const data = await res.json();
        setLists(data);
        setLoading(false);
      }
      fetchLists();
    } else {
      setLoading(true);
    }
  }, [status, router]);

  const createNewList = async (isPredefined = false) => {
    const name = isPredefined ? "Unsere Abenteuer" : "Neue Liste";
    const res = await fetch("/api/list/create", {
      method: "POST",
      body: JSON.stringify({ name, predefined: isPredefined }),
    });
    const data = await res.json();
    router.push(`/list/${data.id}`);
  };

  if (status === "loading" || loading) {
    return <div className="flex items-center justify-center min-h-screen text-gray-500">Lade Dashboard...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 py-16">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-glow">Mein <span className="text-accent-primary">Dashboard</span></h1>
          <p className="text-gray-400 font-light">Willkommen zurück, {session?.user?.name}!</p>
        </div>
        <button 
          onClick={() => signOut()}
          className="p-3 bg-accent-glass border border-accent-border rounded-xl hover:bg-red-500/20 transition-all text-gray-400 hover:text-red-400"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.button 
          whileHover={{ y: -5 }}
          onClick={() => createNewList(false)}
          className="glass-card p-6 flex flex-col items-center justify-center gap-4 hover:border-accent-primary/50 transition-all group"
        >
          <div className="p-3 bg-accent-primary/10 rounded-full group-hover:bg-accent-primary/20">
            <Plus className="w-6 h-6 text-accent-primary" />
          </div>
          <span className="font-semibold">Neue Liste erstellen</span>
        </motion.button>
        <motion.button 
          whileHover={{ y: -5 }}
          onClick={() => createNewList(true)}
          className="glass-card p-6 flex flex-col items-center justify-center gap-4 hover:border-accent-primary/50 transition-all group"
        >
          <div className="p-3 bg-accent-primary/10 rounded-full group-hover:bg-accent-primary/20">
            <Rocket className="w-6 h-6 text-accent-primary" />
          </div>
          <span className="font-semibold">Vorlage laden</span>
        </motion.button>
        <div className="glass-card p-6 flex flex-col items-center justify-center gap-4 opacity-50">
          <div className="p-3 bg-gray-500/10 rounded-full">
            <LayoutDashboard className="w-6 h-6 text-gray-500" />
          </div>
          <span className="font-semibold">Statistiken (Coming Soon)</span>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-6 px-1">Meine Listen</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {lists.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 font-light">
            Du hast noch keine Listen erstellt. Zeit für neue Abenteuer!
          </div>
        ) : (
          lists.map(list => (
            <motion.div 
              key={list.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => router.push(`/list/${list.id}`)}
              className="glass-card p-6 cursor-pointer hover:border-accent-primary/50 transition-all"
            >
              <h3 className="text-lg font-medium mb-2">{list.name}</h3>
              <p className="text-xs text-gray-500">Erstellt am {new Date(list.created_at).toLocaleDateString()}</p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

import { signOut } from "next-auth/react";
