"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/store/useStore";

export default function ProjectLoader() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (id) {
      // Baza məlumatlarını çək
      fetch(`/api/projects/load?id=${id}`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            useStore.setState({
              projectId: data.id,
              furnitureLayers: JSON.parse(data.data),
              wallColor: data.wallColor,
              floorColor: data.floorColor,
              selectedId: null,
              pastLayers: [],
              futureLayers: []
            });
            console.log("Project loaded:", data.name);
          }
        })
        .catch(err => console.error("Failed to load project:", err));
    }
  }, [id]);

  return null;
}
