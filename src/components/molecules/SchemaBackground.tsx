"use client";

import { Background, Controls, MiniMap, BackgroundVariant } from '@xyflow/react';

interface SchemeBackgroundProps {
  showMiniMap?: boolean;
  showControls?: boolean;
  variant?: BackgroundVariant;
  gap?: number;
  size?: number;
  color?: string;
}

export default function SchemeBackground({
  showMiniMap = true,
  showControls = true,
  variant = BackgroundVariant.Dots,
  gap = 12,
  size = 1,
  color = "#ccc"
}: SchemeBackgroundProps) {
  return (
    <>
      <Background variant={variant} gap={gap} size={size} color={color} />
      {showControls && <Controls position="bottom-left" />}
      {showMiniMap && <MiniMap position="bottom-right" zoomable pannable />}
    </>
  );
}