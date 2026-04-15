"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, LogOut, LayoutDashboard, Rocket, Trophy, Target, Star } from "lucide-react";
import { signOut } from "next-auth/react";

interface UserList {
  id: string;
  name: string;
  created_at: string;
  total_items: number;
  completed_items: number;
}

interface GlobalStats {
  total_lists: number;
  total_items: number;
  total_completed: number;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [lists, setLists] = useState<UserList[]>([]);
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      async function fetchDashboard() {
        const res = await fetch("/api/user/lists");
        const data = await res.json();
        if (data.lists) setLists(data.lists);
        if (data.stats) setStats(data.stats);
        setLoading(false);
      }
      fetchDashboard();
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

  const globalProgress = stats 
    ? Math.round((stats.total_completed / stats.total_items) * 100) || 0 
    : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 py-16">
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

      {/* Global Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 flex flex-col justify-center items-center text-center space-y-2"
        >
          <Target className="w-8 h-8 text-accent-primary mb-2" />
          <span className="text-4xl font-bold">{stats?.total_completed || 0}</span>
          <span className="text-gray-400 text-sm">Erledigte Ziele</span>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 flex flex-col justify-center items-center text-center space-y-2"
        >
          <Star className="w-8 h-8 text-accent-primary mb-2" />
          <span className="text-4xl font-bold">{stats?.total_items || 0}</span>
          <span className="text-gray-400 text-sm">Gesamte Träume</span>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 flex flex-col justify-center items-center text-center space-y-2"
        >
          <Trophy className="w-8 h-8 text-accent-primary mb-2" />
          <span className="text-4xl font-bold">{globalProgress}%</span>
          <span className="text-gray-400 text-sm">Gesamt Fortschritt</span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {lists.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 font-light">
            Du hast noch keine Listen erstellt. Zeit für neue Abenteuer!
          </div>
        ) : (
          lists.map(list => {
            const progress = list.total_items > 0 
              ? Math.round((list.completed_items / list.total_items) * 100) 
              : 0;
            return (
              <motion.div 
                key={list.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => router.push(`/list/${list.id}`)}
                className="glass-card p-6 cursor-pointer hover:border-accent-primary/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-medium mb-4">{list.name}</h3>
                  <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden mb-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="bg-accent-primary h-full"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">{list.completed_items}/{list.total_items} erledigt</span>
                    <span className="text-xs font-bold text-accent-primary">{progress}%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-6">Erstellt am {new Date(list.created_at).toLocaleDateString()}</p>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
