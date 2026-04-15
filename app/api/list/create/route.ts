import { NextRequest, NextResponse } from "next/server";
import { createList, createItems } from "@/lib/db";

const PREDEFINED_DATA = [
  { category: "🎬 Entspannt & Cozy Dates", items: ["Kino-Date 🍿", "Sushi essen 🍣", "Gemeinsam kochen", "Raphs BBQ 🌾🔥", "Köln-Date: Omis Hauskost 🥰", "Spieleabend 🎮", "Filmabend mit Motto"] },
  { category: "🎢 Action & Spaß", items: ["Paintball 💥", "KLETTERpark 🌲", "Eislaufen ⛸️", "Bowling 🎳", "Trampolinpark 🤸‍♀️", "Escape Room 🧩", "Schwarzlicht-Minigolf ⛳✨", "Kartfahren"] },
  { category: "🌍 Trips & Kurzurlaube", items: ["Städtetrip 🏙️", "Winterberg ❄️", "Amsterdam-Trip 🚲", "Spontaner Wochenendtrip 🎲", "Wellness-Wochenende 🧖‍♀️", "Roadtrip mit Playlist 🎶🚗", "Berlin hottub (spree)", "Düsseldorf Japanviertel"] },
  { category: "🏛️ Kultur & Entdecken", items: ["Zoo Arnheim 🦁", "Triple Museum Amsterdam 🎨", "Ausstellung / Museum", "Historische Altstadt", "Street-Art-Tour 📸", "Planetarium 🌌", "Street food in Köln"] },
  { category: "🎡 Erlebnisparks & Fun-Vibes", items: ["Karls Erlebnisdorf 🍓", "Phantasialand 🎢❤️", "Freizeitpark bei Nacht", "Jahrmarkt / Kirmes 🎠", "Wasserpark / Therme 💦"] },
  { category: "❤️ Romantische Dates", items: ["Sonnenuntergang anschauen 🌅", "Nachtspaziergang mit Musik 🎧", "Sterne beobachten ⭐", "Brief aneinander schreiben 💌", "Fotodate 📷"] },
  { category: "🔥 Mutige & Besondere Dates", items: ["Kochkurs / Cocktailkurs 🍹", "Tanzkurs 💃🕺", "Sunrise-Date 🌄", "Gemeinsames Tattoo 😉", "Ja-Tag 😄"] },
];

export async function POST(req: NextRequest) {
  try {
    const { name, predefined } = await req.json();
    const listId = await createList(name);

    if (predefined) {
      const flatItems = PREDEFINED_DATA.flatMap(cat => 
        cat.items.map(text => ({ category: cat.category, text }))
      );
      await createItems(listId, flatItems);
    }

    return NextResponse.json({ id: listId });
  } catch (e) {
    console.error("Create List Error:", e);
    return NextResponse.json({ error: "Failed to create list" }, { status: 500 });
  }
}
