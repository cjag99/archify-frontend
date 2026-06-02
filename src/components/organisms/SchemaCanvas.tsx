"use client";

import React, { useEffect, useRef } from "react";
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

  // Inicialización del grafo
  useEffect(() => {
    if (!containerRef.current) return;

    const isDarkMode = resolvedTheme === "dark" || document.documentElement.classList.contains("dark");
    const backgroundColor = isDarkMode ? "#0f172a" : "#f8fafc";
    const gridColor = isDarkMode ? "#475569" : "#e2e8f0";
    const edgeStrokeColor = isDarkMode ? "#64748b" : "#94a3b8";

    // Registro de nodos
    Object.entries(nodeTypes).forEach(([type, component]) => {
      try {
        register({
          shape: `custom-${type}`,
          width: 96,
          height: 96,
          component: component as CustomNodeComponent,
        });
      } catch {
        // Evitar errores de registro duplicado en Hot Reload
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
      // --- MEJORA 1: Configurar estrategia de conexión global ---
      connecting: {
        snap: true,
        allowBlank: false,
        allowLoop: false,
        allowNode: true, 
        highlight: true,
        router: {
          name: 'manhattan', // Fuerza líneas ortogonales limpias (a 90 grados)
        },
        anchor: 'center', // Si no se usa un puerto, las flechas apuntan al centro geométrico del nodo de manera uniforme
        connectionPoint: 'boundary', // Evita que la flecha se meta "dentro" del componente visual
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

    // Escuchar movimientos
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

    // Escuchar conexiones
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

    // --- NUEVO: Escuchar cambios en vértices o rutas de las aristas ---
    graph.on("edge:changed", ({ options }) => {
      // Solo disparamos el cambio si no viene de una sincronización externa (evita bucles)
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

    return () => {
      if (graph) {
        graph.dispose();
      }
    };
  }, [nodeTypes, onConnect, onEdgesChange, onNodesChange, readonly]);

  // Sincronizar Nodos
  useEffect(() => {
    const graph = graphRef.current;
    if (!graph) return;

    nodes.forEach((node) => {
      if (!node.type) return; 
      
      const shapeName = `custom-${node.type}`;
      if (nodeTypes[node.type] && !graph.getCellById(node.id)) {
        try {
          graph.addNode({
            id: node.id,
            shape: shapeName,
            x: node.position?.x || 0,
            y: node.position?.y || 0,
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
        } catch (error) {
          console.warn(`Error adding node ${shapeName}:`, error);
        }
      }
    });

    // --- MEJORA 2: Forzar recalculación de rutas tras el renderizado de los componentes React ---
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
          
          // Padding dinámico según el ancho de la pantalla
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
    // Añadimos edges a la dependencia para que el zoomToFit ocurra cuando todo el esquema esté listo
  }, [nodes, edges, nodeTypes, readonly]);

  // Sincronizar Aristas
  useEffect(() => {
    const graph = graphRef.current;
    if (!graph) return;

    const isDarkMode = resolvedTheme === "dark";
    const edgeStrokeColor = isDarkMode ? "#64748b" : "#94a3b8";

    edges.forEach((edge) => {
      if (!graph.getCellById(edge.id)) {
        try {
          // --- MEJORA 3: Asegurar la unión limpia al nodo o puerto ---
          graph.addEdge({
            id: edge.id,
            source: edge.source_port ? { cell: edge.source, port: edge.source_port } : edge.source,
            target: edge.target_port ? { cell: edge.target, port: edge.target_port } : edge.target,
            vertices: edge.vertices || [],
            router: { name: 'manhattan' }, // Mantener el comportamiento ortogonal
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

  // ✨ Actualización dinámica del tema sin destruir el grafo
  useEffect(() => {
    const graph = graphRef.current;
    if (!graph) return;

    const isDarkMode = resolvedTheme === "dark";
    const backgroundColor = isDarkMode ? "#0f172a" : "#f8fafc";
    const gridColor = isDarkMode ? "#475569" : "#e2e8f0";
    const edgeStrokeColor = isDarkMode ? "#64748b" : "#94a3b8";

    graph.drawBackground({ color: backgroundColor });
    graph.grid.update({ args: { color: gridColor } });
    graph.getEdges().forEach(edge => {
      edge.attr('line/stroke', edgeStrokeColor);
    });
  }, [resolvedTheme]);

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