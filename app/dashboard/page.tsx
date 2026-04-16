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

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

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
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 font-light tracking-widest animate-pulse">
        Lade Dashboard...
      </div>
    );
  }

  const globalProgress = stats 
    ? Math.round((stats.total_completed / stats.total_items) * 100) || 0 
    : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 py-16">
      <div className="flex items-center justify-between mb-16">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold tracking-tighter text-glow">Mein <span className="text-accent-primary">Dashboard</span></h1>
          <p className="text-gray-400 font-light mt-2 opacity-80">Willkommen zurück, {session?.user?.name}!</p>
        </motion.div>
        <motion.button 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => signOut()}
          className="p-3 bg-accent-glass border border-accent-border rounded-xl hover:bg-red-500/20 transition-all text-gray-400 hover:text-red-400"
        >
          <LogOut className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Global Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {[
          { icon: Target, value: stats?.total_completed || 0, label: "Erledigte Ziele" },
          { icon: Star, value: stats?.total_items || 0, label: "Gesamte Träume" },
          { icon: Trophy, value: `${globalProgress}%`, label: "Gesamt Fortschritt" },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="glass-card p-8 flex flex-col justify-center items-center text-center space-y-3 group hover:border-accent-primary/40 transition-all"
          >
            <stat.icon className="w-8 h-8 text-accent-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-5xl font-bold tracking-tighter">{stat.value}</span>
            <span className="text-gray-400 text-sm font-light uppercase tracking-widest opacity-70">{stat.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <motion.button 
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => createNewList(false)}
          className="glass-card p-8 flex flex-col items-center justify-center gap-4 hover:border-accent-primary/50 transition-all group"
        >
          <div className="p-4 bg-accent-primary/10 rounded-full group-hover:bg-accent-primary/20 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all">
            <Plus className="w-6 h-6 text-accent-primary" />
          </div>
          <span className="font-semibold tracking-tight">Neue Liste erstellen</span>
        </motion.button>
        <motion.button 
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => createNewList(true)}
          className="glass-card p-8 flex flex-col items-center justify-center gap-4 hover:border-accent-primary/50 transition-all group"
        >
          <div className="p-4 bg-accent-primary/10 rounded-full group-hover:bg-accent-primary/20 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all">
            <Rocket className="w-6 h-6 text-accent-primary" />
          </div>
          <span className="font-semibold tracking-tight">Vorlage laden</span>
        </motion.button>
        <div className="glass-card p-8 flex flex-col items-center justify-center gap-4 opacity-40 grayscale">
          <div className="p-4 bg-gray-500/10 rounded-full">
            <LayoutDashboard className="w-6 h-6 text-gray-500" />
          </div>
          <span className="font-semibold tracking-tight">Statistiken (Coming Soon)</span>
        </div>
      </div>

      <motion.h2 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="text-2xl font-semibold mb-8 px-1 tracking-tight"
      >
        Meine Listen
      </motion.h2>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {lists.length === 0 ? (
          <div className="col-span-full text-center py-20 text-gray-500 font-light italic">
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
                variants={itemVariants}
                whileHover={{ scale: 1.03, translateY: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(`/list/${list.id}`)}
                className="glass-card p-6 cursor-pointer hover:border-accent-primary/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <h3 className="text-xl font-medium mb-6 group-hover:text-accent-primary transition-colors">{list.name}</h3>
                  <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden mb-3">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="bg-accent-primary h-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 font-light">{list.completed_items}/{list.total_items} erledigt</span>
                    <span className="text-xs font-bold text-accent-primary tracking-tighter">{progress}%</span>
                  </div>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-gray-600 mt-8 opacity-60">Erstellt am {new Date(list.created_at).toLocaleDateString()}</p>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </div>
  );
}
