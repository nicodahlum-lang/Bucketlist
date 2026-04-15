import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bucketlist ✨',
    short_name: 'Bucketlist',
    description: 'Plane deine größten Abenteuer und verliere deine Träume nie aus den Augen.',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090B',
    theme_color: '#A855F7',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
