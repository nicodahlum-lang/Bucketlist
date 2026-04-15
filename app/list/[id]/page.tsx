"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Share2, Plus } from "lucide-react";

interface Item {
  id: string;
  category: string;
  text: string;
  completed: boolean;
}

export default function ListPage() {
  const params = useParams();
  const listId = params.id as string;
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItemText, setNewItemText] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    async function fetchItems() {
      const res = await fetch(`/api/list/${listId}`);
      const data = await res.json();
      setItems(data);
      if (data.length > 0) setActiveCategory(data[0].category);
      setLoading(false);
    }
    fetchItems();
  }, [listId]);

  const toggleItem = async (id: string, currentStatus: boolean) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, completed: !currentStatus } : item));
    await fetch(`/api/list/${listId}/toggle`, {
      method: "PATCH",
      body: JSON.stringify({ id, completed: !currentStatus }),
    });
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const newItem = { text: newItemText, category: activeCategory || "Allgemein" };
    const res = await fetch(`/api/list/${listId}/item`, {
      method: "POST",
      body: JSON.stringify(newItem),
    });
    const addedItem = await res.json();
    setItems([...items, addedItem]);
    setNewItemText("");
  };

  const shareList = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link kopiert! Teile ihn mit deinen Liebsten ❤️");
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-500 font-light">Lade Abenteuer...</div>;

  const categories = Array.from(new Set(items.map(i => i.category)));

  return (
    <div className="max-w-3xl mx-auto p-6 py-16">
      <div className="flex items-center justify-between mb-16">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold tracking-tight text-glow"
        >
          Unsere Bucket List <span className="text-accent-primary">✨</span>
        </motion.h1>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={shareList}
          className="p-3 bg-accent-glass border border-accent-border rounded-xl hover:bg-accent-primary/20 transition-all text-gray-400 hover:text-white"
        >
          <Share2 className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="space-y-16">
        {categories.map((cat) => (
          <div key={cat} className="space-y-6">
            <h2 className="text-sm font-medium uppercase tracking-widest text-accent-primary/80 px-1">
              {cat}
            </h2>
            <div className="grid gap-3">
              <AnimatePresence mode="popLayout">
                {items.filter(i => i.category === cat).map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-card p-5 flex items-center justify-between group cursor-pointer"
                    onClick={() => toggleItem(item.id, item.completed)}
                  >
                    <div className="flex items-center gap-4">
                      {item.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-accent-primary transition-all" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-700 group-hover:text-accent-primary/50 transition-all" />
                      )}
                      <span className={`text-lg font-light transition-all ${item.completed ? "line-through text-gray-600" : "text-gray-300"}`}>
                        {item.text}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={addItem}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-4"
      >
        <div className="glass-card p-2 flex items-center gap-2 border-accent-border hover:border-accent-primary/30 transition-all">
          <input 
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Neue Idee hinzufügen..."
            className="bg-transparent border-none focus:ring-0 flex-1 px-4 py-2 text-white placeholder:text-gray-600 font-light"
          />
          <button type="submit" className="p-3 bg-accent-primary text-white rounded-lg hover:bg-purple-600 transition-all shadow-lg shadow-accent-primary/20">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </motion.form>
    </div>
  );
}
