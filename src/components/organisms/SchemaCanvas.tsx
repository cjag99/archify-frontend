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
  const { resolvedTheme } = useTheme();
  const [isCollapsedViewport, setIsCollapsedViewport] = useState(false);

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

    const isDarkMode = resolvedTheme === "dark" || document.documentElement.classList.contains("dark");
    const backgroundColor = isDarkMode ? "#0f172a" : "#f8fafc";
    const gridColor = isDarkMode ? "#475569" : "#e2e8f0";
    const edgeStrokeColor = isDarkMode ? "#64748b" : "#94a3b8";


    Object.entries(nodeTypes).forEach(([type, component]) => {
      try {
        register({
          shape: `custom-${type}`,
          width: 96,
          height: 96,
          component: component as CustomNodeComponent,
        });
      } catch {

      }
    });

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
        connectionPoint: 'boundary',
        createEdge() {
          return new Shape.Edge({
            shape: 'edge',
            attrs: {
              line: {
                stroke: edgeStrokeColor,
                strokeWidth: 2,
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


    graph.on("edge:connected", ({ edge }) => {
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


            const isSmall = c.clientWidth < 640;
            const targetW = isSmall ? 64 : 96;
            const targetH = isSmall ? 64 : 96;


            graphRef.current.getNodes().forEach((n) => {
              try {
                n.resize(targetW, targetH);
                const view = graphRef.current!.findViewByCell(n);
                if (view) (view as any).update();
              } catch (e) {

              }
            });


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
  }, [nodeTypes, onConnect, onEdgesChange, onNodesChange, readonly]);


  useEffect(() => {
    const graph = graphRef.current;
    if (!graph) return;

    nodes.forEach((node) => {
      if (!node.type) return; 
      
      const shapeName = `custom-${node.type}`;
      if (nodeTypes[node.type] && !graph.getCellById(node.id)) {
        try {
          const cwidth = containerRef.current?.clientWidth || window.innerWidth || 1024;
          const small = cwidth < 640;
          const nodeW = small ? 64 : 96;
          const nodeH = small ? 64 : 96;


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
                top: { position: 'top', attrs: { circle: { r: 5, magnet: true, stroke: '#94a3b8', fill: '#fff', strokeWidth: 2 } } },
                bottom: { position: 'bottom', attrs: { circle: { r: 5, magnet: true, stroke: '#94a3b8', fill: '#fff', strokeWidth: 2 } } },
                left: { position: 'left', attrs: { circle: { r: 5, magnet: true, stroke: '#94a3b8', fill: '#fff', strokeWidth: 2 } } },
                right: { position: 'right', attrs: { circle: { r: 5, magnet: true, stroke: '#94a3b8', fill: '#fff', strokeWidth: 2 } } },
              },
              items: [
                { id: 'port-top', group: 'top' },
                { id: 'port-bottom', group: 'bottom' },
                { id: 'port-left', group: 'left' },
                { id: 'port-right', group: 'right' },
              ],
            },
          });


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

  }, [nodes, edges, nodeTypes, readonly]);


  useEffect(() => {
    const graph = graphRef.current;
    if (!graph) return;

    const isDarkMode = resolvedTheme === "dark";
    const edgeStrokeColor = isDarkMode ? "#64748b" : "#94a3b8";

    edges.forEach((edge) => {
      if (!graph.getCellById(edge.id)) {
        try {

          graph.addEdge({
            id: edge.id,
            source: edge.source_port ? { cell: edge.source, port: edge.source_port } : edge.source,
            target: edge.target_port ? { cell: edge.target, port: edge.target_port } : edge.target,
            vertices: edge.vertices || [],
            router: { name: 'manhattan' },
            attrs: {
              line: {
                stroke: edgeStrokeColor,
                strokeWidth: 2,
              },
            },
          });
        } catch (error) {
          console.warn(`Error adding edge ${edge.id}:`, error);
        }
      }
    });
  }, [edges]);


  useEffect(() => {
    const graph = graphRef.current;
    if (!graph) return;

    const isDarkMode = resolvedTheme === "dark";
    const backgroundColor = isDarkMode ? "#0f172a" : "#f8fafc";
    const gridColor = isDarkMode ? "#475569" : "#e2e8f0";
    const edgeStrokeColor = isDarkMode ? "#64748b" : "#94a3b8";

    graph.drawBackground({ color: backgroundColor });
    graph.grid.update({ color: gridColor } as any);
    graph.getEdges().forEach(edge => {
      edge.attr('line/stroke', edgeStrokeColor);
    });
  }, [resolvedTheme]);

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
        `}</style>
        <div ref={containerRef} className="w-full h-full" />
      </div>
    </>
  );
}