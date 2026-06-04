// Page-level UI component that renders the SchemaCanvas interface
"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Graph, Node, Shape, Scroller } from "@antv/x6";
import { register, getProvider } from "@antv/x6-react-shape";

type CustomNodeComponent = React.ComponentType<{ node: Node; graph: Graph }>;

export interface SchemaCanvasProps {
  nodes: any[];
  edges: any[];
  nodeTypes: Record<string, React.ComponentType<any>>;
  onNodesChange?: (nodes: any[]) => void;
  onEdgesChange?: (edges: any[]) => void;
  onConnect?: (connection: any) => void;
  readonly?: boolean;
}

const PortalProvider = getProvider();

export default function SchemaCanvas({ nodes = [], edges = [], nodeTypes, onNodesChange, onEdgesChange, onConnect, readonly = false }: SchemaCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);
  const { theme, resolvedTheme } = useTheme();
  const [isCollapsedViewport, setIsCollapsedViewport] = useState(false);

  const currentTheme = resolvedTheme ?? theme ?? (typeof window !== "undefined" && document.documentElement.classList.contains("dark") ? "dark" : "light");
  const isDarkMode = currentTheme === "dark";
  const backgroundColor = isDarkMode ? "#020617" : "#f8fafc";
  const gridColor = isDarkMode ? "#1f2937" : "#e2e8f0";
  const edgeStrokeColor = isDarkMode ? "#7c3aed" : "#22d3ee";
  const portStrokeColor = isDarkMode ? "#7c3aed" : "#22d3ee";

  useEffect(() => {
    const check = () => {
      if (typeof window === "undefined") return;
      const collapsed = window.innerWidth < 900;
      setIsCollapsedViewport(collapsed);
      if (collapsed) {
        try {
          if (onNodesChange && (nodes?.length || 0) > 0) onNodesChange([]);
          if (onEdgesChange && (edges?.length || 0) > 0) onEdgesChange([]);
        } catch {}
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [onNodesChange, onEdgesChange, nodes, edges]);

  useEffect(() => {
    if (!containerRef.current) return;


    Object.entries(nodeTypes).forEach(([type, component]) => {
      try {
        register({
          shape: `custom-${type}`,
          width: 108,
          height: 108,
          component: component as CustomNodeComponent,
        });
      } catch {

      }
    });

    const getLiveEdgeStrokeColor = () => {
      if (typeof window === "undefined") return edgeStrokeColor;
      return document.documentElement.classList.contains("dark") ? "#7c3aed" : "#22d3ee";
    };

    const graph = new Graph({
      container: containerRef.current,
      autoResize: true,
      background: { color: backgroundColor },
      grid: {
        visible: true,
        type: 'mesh',
        size: 10,
        args: {
          color: gridColor,
          thickness: 1,
        },
      },

      connecting: {
        snap: true,
        allowBlank: false,
        allowLoop: false,
        allowNode: true, 
        highlight: true,
        router: {
          name: 'manhattan',
        },
        anchor: 'center',
        connectionPoint: 'anchor',
        createEdge() {
          const color = getLiveEdgeStrokeColor();
          return new Shape.Edge({
            shape: 'edge',
            connector: { name: 'rounded' },
            attrs: {
              line: {
                class: 'tech-edge-line',
                stroke: color,
                strokeWidth: 3,
                strokeLinecap: 'round',
                targetMarker: {
                  name: 'classic',
                  size: 12,
                  attrs: {
                    fill: color,
                  },
                },
              },
            },
            zIndex: -1,
          });
        },
      },
    } as any);

    graph.use(
      new Scroller({
        enabled: true,
        pannable: !readonly,
      })
    );


    graph.on("node:moved", () => {
      if (onNodesChange) {
        onNodesChange(graph.getNodes().map((n) => ({
          id: n.id,
          type: n.shape.replace("custom-", ""),
          position: n.getPosition(),
          data: n.getData(),
        })));
      }
    });

    graph.on("node:change:size", () => {
      graph.getEdges().forEach((edge) => {
        const view = graph.findViewByCell(edge);
        if (view) (view as any).update();
      });
    });


    graph.on("edge:connected", ({ edge }) => {
      const view = graph.findViewByCell(edge);
      const color = getLiveEdgeStrokeColor();
      edge.attr('line/stroke', color);
      edge.attr('line/targetMarker/fill', color);
      if (view) (view as any).update();

      if (onConnect) {
        onConnect({
          id: edge.id,
          source: edge.getSourceCellId(),
          source_port: (edge.getSource() as any).port,
          target: edge.getTargetCellId(),
          target_port: (edge.getTarget() as any).port,
          vertices: edge.getVertices(),
        });
      }
    });


    graph.on("edge:changed", ({ options }) => {

      if (options.external) return;
      
      if (onEdgesChange) {
        const allEdges = graph.getEdges().map(e => ({
          id: e.id,
          source: e.getSourceCellId(),
          source_port: (e.getSource() as any).port,
          target: e.getTargetCellId(),
          target_port: (e.getTarget() as any).port,
          vertices: e.getVertices(),
        }));
        onEdgesChange(allEdges);
      }
    });

    graphRef.current = graph;


    if (containerRef.current) {
      const ro = new ResizeObserver(() => {
        try {
          const c = containerRef.current;
          if (c && graphRef.current) {
            graphRef.current.resize(c.clientWidth, c.clientHeight);

            try {
              graphRef.current.drawBackground({ color: backgroundColor });
              graphRef.current.grid.update({ color: gridColor } as any);
            } catch {}

            graphRef.current.getEdges().forEach((e) => {
              try {
                const view = graphRef.current!.findViewByCell(e);
                if (view) (view as any).update();
              } catch {}
            });
          }
        } catch (e) {

        }
      });
      ro.observe(containerRef.current);

      (graph as any).__resizeObserver = ro;
    }

    return () => {
      if (graph) {
        try {
          const ro = (graph as any).__resizeObserver as ResizeObserver | undefined;
          if (ro && containerRef.current) ro.unobserve(containerRef.current);
        } catch {}
        graph.dispose();
      }
    };
  }, [nodeTypes, onConnect, onEdgesChange, onNodesChange, readonly, backgroundColor, gridColor, edgeStrokeColor]);


  useEffect(() => {
    const graph = graphRef.current;
    if (!graph) return;

    nodes.forEach((node) => {
      if (!node.type) return; 
      
      const shapeName = `custom-${node.type}`;
      if (nodeTypes[node.type] && !graph.getCellById(node.id)) {
        try {
          const nodeW = 108;
          const nodeH = 108;

          const rect = containerRef.current?.getBoundingClientRect();
          const centerX = rect ? Math.floor(rect.width / 2 - nodeW / 2) : (node.position?.x ?? 0);
          const centerY = rect ? Math.floor(rect.height / 2 - nodeH / 2) : (node.position?.y ?? 0);

          const added = graph.addNode({
            id: node.id,
            shape: shapeName,
            x: typeof node.position?.x === 'number' ? node.position.x : centerX,
            y: typeof node.position?.y === 'number' ? node.position.y : centerY,
            width: nodeW,
            height: nodeH,
            data: node.data,
            ports: {
              groups: {
                top: { position: 'top', attrs: { circle: { r: 7, magnet: true, stroke: portStrokeColor, fill: '#fff', strokeWidth: 3 } } },
                bottom: { position: 'bottom', attrs: { circle: { r: 7, magnet: true, stroke: portStrokeColor, fill: '#fff', strokeWidth: 3 } } },
                left: { position: 'left', attrs: { circle: { r: 7, magnet: true, stroke: portStrokeColor, fill: '#fff', strokeWidth: 3 } } },
                right: { position: 'right', attrs: { circle: { r: 7, magnet: true, stroke: portStrokeColor, fill: '#fff', strokeWidth: 3 } } },
              },
              items: [
                { id: 'port-top', group: 'top' },
                { id: 'port-bottom', group: 'bottom' },
                { id: 'port-left', group: 'left' },
                { id: 'port-right', group: 'right' },
              ],
            },
          });

          const addedView = graph.findViewByCell(added);
          if (addedView) (addedView as any).update();

          if (typeof node.position?.x !== 'number' || typeof node.position?.y !== 'number') {
            try {
              const rect = containerRef.current?.getBoundingClientRect();
              if (rect) {
                const clientCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
                const clientToLocal = (graph as any).clientToLocalPoint || (graph as any).clientToLocal;
                const local = clientToLocal ? clientToLocal.call(graph, clientCenter.x, clientCenter.y) : { x: centerX, y: centerY };

                (added as any).position(local.x - nodeW / 2, local.y - nodeH / 2);
                const view = graph.findViewByCell(added);
                if (view) (view as any).update();
              }
            } catch (err) {

            }
          }
        } catch (error) {
          console.warn(`Error adding node ${shapeName}:`, error);
        }
      }
    });


    if (readonly) {
      const handleResize = () => {
        const currentGraph = graphRef.current; 
        if (currentGraph) {
          currentGraph.getEdges().forEach((edge) => {
            const view = currentGraph.findViewByCell(edge);
            if (view) {
              (view as any).update(); 
            }
          });
          

          const fitPadding = window.innerWidth < 768 ? 20 : 80;
          currentGraph.zoomToFit({ padding: fitPadding, maxScale: 1 });
          currentGraph.centerContent();
        }
      };

      const timer = setTimeout(handleResize, 300);
      window.addEventListener("resize", handleResize);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", handleResize);
      };
    }

  }, [nodes, edges, nodeTypes, readonly, portStrokeColor]);


  useEffect(() => {
    const graph = graphRef.current;
    if (!graph) return;

    edges.forEach((edge) => {
      if (!graph.getCellById(edge.id)) {
        try {
          const addedEdge = graph.addEdge({
            id: edge.id,
            source: edge.source_port ? { cell: edge.source, port: edge.source_port } : edge.source,
            target: edge.target_port ? { cell: edge.target, port: edge.target_port } : edge.target,
            vertices: edge.vertices || [],
            router: { name: 'manhattan' },
            attrs: {
              line: {
                class: 'tech-edge-line',
                stroke: edgeStrokeColor,
                strokeWidth: 3,
                strokeLinecap: 'round',
                targetMarker: {
                  name: 'classic',
                  size: 12,
                  attrs: {
                    fill: edgeStrokeColor,
                  },
                },
              },
            },
          });

          const edgeView = graph.findViewByCell(addedEdge);
          if (edgeView) (edgeView as any).update();
        } catch (error) {
          console.warn(`Error adding edge ${edge.id}:`, error);
        }
      }
    });
  }, [edges, edgeStrokeColor]);


  useEffect(() => {
    const graph = graphRef.current;
    if (!graph) return;

    graph.drawBackground({ color: backgroundColor });
    graph.grid.update({ color: gridColor } as any);
    if ((graph as any).container) {
      ((graph as any).container as HTMLElement).style.setProperty("background-color", backgroundColor);
    }
    if (containerRef.current) {
      containerRef.current.style.setProperty("background-color", backgroundColor);
    }

    graph.getEdges().forEach(edge => {
      edge.attr('line/stroke', edgeStrokeColor);
      edge.attr('line/targetMarker/fill', edgeStrokeColor);
      const view = graph.findViewByCell(edge);
      if (view) (view as any).update();
    });

    graph.getNodes().forEach(node => {
      const ports = (node as any).getPorts?.() || [];
      ports.forEach((port: any) => {
        (node as any).portProp?.(port.id, 'attrs/circle/stroke', portStrokeColor);
      });
      const view = graph.findViewByCell(node);
      if (view) (view as any).update();
    });
  }, [backgroundColor, gridColor, edgeStrokeColor, portStrokeColor]);

  if (isCollapsedViewport) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[240px]">
        <div className="max-w-md rounded-2xl border border-slate-700 bg-slate-900/60 p-6 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Editor not available on mobile</h3>
          <p className="text-sm text-slate-300 mb-2">For the best experience please edit the schema on a desktop or laptop. The visual editor is disabled on small screens.</p>
          <p className="text-xs text-slate-400">Schema will be saved as an empty JSON on mobile.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PortalProvider />
      <div className="relative w-full h-full pointer-events-auto overflow-hidden bg-white dark:bg-slate-950">
        <style>{`
          .x6-graph-svg {
            overflow: visible !important;
          }

          .tech-edge-line {
            stroke-dasharray: 12 8;
            stroke-dashoffset: 0;
            animation: tech-dash 1.3s linear infinite, tech-glow 3.5s ease-in-out infinite alternate;
            vector-effect: non-scaling-stroke;
            stroke-opacity: 0.95;
            filter: drop-shadow(0 0 10px rgba(34, 211, 238, 0.45));
          }

          .dark .tech-edge-line {
            filter: drop-shadow(0 0 12px rgba(124, 58, 237, 0.55));
          }

          @keyframes tech-dash {
            to {
              stroke-dashoffset: -20;
            }
          }

          @keyframes tech-glow {
            from {
              opacity: 0.85;
            }
            to {
              opacity: 1;
            }
          }
        `}</style>
        <div
          ref={containerRef}
          className="w-full h-full"
          style={{ backgroundColor }}
        />
      </div>
    </>
  );
}