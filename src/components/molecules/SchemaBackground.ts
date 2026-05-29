"use client";

import { Graph } from "@antv/x6";

interface SchemeBackgroundOptions {
  showMiniMap?: boolean;
  showControls?: boolean;
  gap?: number;
  color?: string;
}

export function applySchemeBackground(
  graph: Graph,
  {
    showMiniMap = true,
    showControls = true,
    gap = 12,
    color = "#cbd5e1",
  }: SchemeBackgroundOptions = {}
) {
  if (!graph) return;


  graph.setGridSize(gap);
  graph.showGrid();

  if (graph.grid) {
    graph.grid.update([
      {
        color: color,
        thickness: 1,
      },
    ]);
  }

  const options = graph.options as any;

  if (showControls && options.scroller) {
    options.scroller.enabled = true;
    options.scroller.pannable = true;
  } else if (options.scroller) {
    options.scroller.enabled = false;
    options.scroller.pannable = false;
  }

  if (showMiniMap && options.minimap) {
    let minimapContainer = document.getElementById("archify-minimap");
    
    if (!minimapContainer) {
      minimapContainer = document.createElement("div");
      minimapContainer.id = "archify-minimap";
      minimapContainer.className = "absolute bottom-4 right-4 z-50 border border-slate-200 rounded-xl shadow-md bg-white overflow-hidden pointer-events-auto";
      minimapContainer.style.width = "200px";
      minimapContainer.style.height = "120px";
      
      graph.container.parentElement?.appendChild(minimapContainer);
    }

    options.minimap.enabled = true;
    options.minimap.container = minimapContainer;
  } else if (options.minimap) {
    options.minimap.enabled = false;
  }
}