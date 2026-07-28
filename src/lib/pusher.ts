import Pusher from "pusher";
import PusherClient from "pusher-js";

const appId = process.env.PUSHER_APP_ID || "";
const key = process.env.NEXT_PUBLIC_PUSHER_KEY || "";
const secret = process.env.PUSHER_SECRET || "";
const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "eu";

export const isPusherConfigured = !!(appId && key && secret);

// Server-side Pusher obyekt
export const pusherServer = isPusherConfigured
  ? new Pusher({
      appId,
      key,
      secret,
      cluster,
      useTLS: true,
    })
  : null;

// Client-side Pusher obyektini yaradan funksiya (brauzerdə təkrar yaradılmanın qarşısını almaq üçün)
let clientInstance: PusherClient | null = null;

export const getPusherClient = () => {
  if (typeof window === "undefined") return null;
  if (!key) {
    console.warn("Pusher CLIENT key tapılmadı. .env faylını yoxlayın.");
    return null;
  }
  if (!clientInstance) {
    clientInstance = new PusherClient(key, {
      cluster,
      authEndpoint: "/api/multiplayer/auth",
    });
  }
  return clientInstance;
};
