"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Share2, Plus, Trash2 } from "lucide-react";

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

  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-500">Lade Abenteuer...</div>;

  const categories = Array.from(new Set(items.map(i => i.category)));

  return (
    <div className="max-w-3xl mx-auto p-6 py-12">
      <div className="flex items-center justify-between mb-12">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold text-glow"
        >
          Unsere Bucket List ✨
        </motion.h1>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={shareList}
          className="p-3 bg-accent-glass border border-accent-border rounded-full hover:bg-accent-primary/20 transition-colors"
        >
          <Share2 className="w-6 h-6" />
        </motion.button>
      </div>

      <div className="space-y-12">
        {categories.map((cat) => (
          <div key={cat} className="space-y-4">
            <h2 className="text-xl font-semibold text-accent-primary flex items-center gap-2">
              <span className="w-2 h-2 bg-accent-primary rounded-full" />
              {cat}
            </h2>
            <div className="grid gap-3">
              <AnimatePresence mode="popLayout">
                {items.filter(i => i.category === cat).map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-card p-4 flex items-center justify-between group hover:border-accent-primary/40 transition-colors cursor-pointer"
                    onClick={() => toggleItem(item.id, item.completed)}
                  >
                    <div className="flex items-center gap-4">
                      {item.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-accent-primary transition-all" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-600 group-hover:text-accent-primary/50 transition-all" />
                      )}
                      <span className={`text-lg transition-all ${item.completed ? "line-through text-gray-500" : "text-gray-200"}`}>
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onSubmit={addItem}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-4"
      >
        <div className="glass-card p-2 flex items-center gap-2 border-accent-primary/30">
          <input 
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Neue Idee hinzufügen..."
            className="bg-transparent border-none focus:ring-0 flex-1 px-4 py-2 text-white placeholder:text-gray-500"
          />
          <button type="submit" className="p-3 bg-accent-primary text-white rounded-xl hover:bg-blue-600 transition-all">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </motion.form>
    </div>
  );
}
