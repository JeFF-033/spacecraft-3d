import { useEffect, useRef, useCallback } from "react";
import { useStore } from "@/store/useStore";
import { useSession } from "next-auth/react";
import { getPusherClient } from "@/lib/pusher";

export function useMultiplayer() {
  const { projectId, isTransforming } = useStore();
  const { data: session } = useSession();
  
  // Track the last state as string to avoid unnecessary re-renders
  const lastKnownState = useRef("");
  const isFetchingRef = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Hook to push updates instantly
  const pushUpdate = useCallback(async () => {
    const state = useStore.getState();
    const currentProjId = state.projectId;
    if (!currentProjId) return;

    const dataString = JSON.stringify({
      layers: state.furnitureLayers,
      wallColor: state.wallColor,
      floorColor: state.floorColor
    });

    if (dataString === lastKnownState.current) return;
    lastKnownState.current = dataString;

    try {
      await fetch("/api/projects/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: currentProjId,
          data: state.furnitureLayers,
          wallColor: state.wallColor,
          floorColor: state.floorColor
        })
      });
      console.log("Auto-sync: Layihə anında bazaya yazıldı ⚡");
    } catch (err) {
      console.error("Auto-sync error:", err);
    }
  }, []);

  // Listen to store changes and trigger debounced auto-push when not transforming
  useEffect(() => {
    if (!projectId || isTransforming) return;

    const unsubscribe = useStore.subscribe((state) => {
      if (state.isTransforming) return;
      
      const currentState = JSON.stringify({
        layers: state.furnitureLayers,
        wallColor: state.wallColor,
        floorColor: state.floorColor
      });

      if (currentState !== lastKnownState.current) {
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = setTimeout(() => {
          pushUpdate();
        }, 250); // 250ms debounce for instant auto-save
      }
    });

    return () => {
      unsubscribe();
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [projectId, isTransforming, pushUpdate]);

  // Real-time synchronization loop (Pusher or 800ms Fast Polling)
  useEffect(() => {
    if (!projectId || isTransforming) return;

    const pusher = getPusherClient();

    if (pusher) {
      const channelName = `project-${projectId}`;
      const channel = pusher.subscribe(channelName);

      channel.bind("project-updated", (payload: any) => {
        if (payload.senderEmail === session?.user?.email) return;

        const dataString = JSON.stringify({
          layers: payload.furnitureLayers,
          wallColor: payload.wallColor,
          floorColor: payload.floorColor
        });

        if (dataString !== lastKnownState.current) {
          lastKnownState.current = dataString;
          useStore.setState({
            furnitureLayers: payload.furnitureLayers,
            wallColor: payload.wallColor,
            floorColor: payload.floorColor
          });
        }
      });

      return () => {
        pusher.unsubscribe(channelName);
      };
    } else {
      // 800ms Ultra-Fast Polling for zero latency on local/production fallback
      const interval = setInterval(async () => {
        if (isFetchingRef.current || useStore.getState().isTransforming) return;
        isFetchingRef.current = true;

        try {
          const currentProjId = useStore.getState().projectId;
          if (!currentProjId) return;

          const res = await fetch(`/api/projects/load?id=${currentProjId}`);
          if (!res.ok) return;
          const data = await res.json();

          if (data && data.data) {
            const dataString = JSON.stringify({
              layers: JSON.parse(data.data),
              wallColor: data.wallColor,
              floorColor: data.floorColor
            });

            if (dataString !== lastKnownState.current) {
              lastKnownState.current = dataString;
              const parsed = JSON.parse(data.data);
              useStore.setState({
                furnitureLayers: parsed,
                wallColor: data.wallColor,
                floorColor: data.floorColor
              });
              console.log("Auto-sync: Səhnə telefonda/brauzerdə yeniləndi 🚀");
            }
          }
        } catch (err) {
          console.error("Multiplayer Sync error:", err);
        } finally {
          isFetchingRef.current = false;
        }
      }, 800);

      return () => clearInterval(interval);
    }
  }, [projectId, isTransforming, session?.user?.email]);

  return { pushUpdate };
}
