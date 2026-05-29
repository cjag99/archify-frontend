"use client";

import React, { useEffect, useRef } from "react";
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
}

// En X6 v3, es obligatorio renderizar el PortalProvider para que los nodos de React funcionen
const PortalProvider = getProvider();

export default function SchemaCanvas({ nodes = [], edges = [], nodeTypes, onNodesChange, onEdgesChange, onConnect }: SchemaCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);

  // Inicialización del grafo
  useEffect(() => {
    if (!containerRef.current) return;

    // Registro de nodos
    Object.entries(nodeTypes).forEach(([type, component]) => {
      try {
        register({
          shape: `custom-${type}`,
          width: 96,
          height: 96,
          component: component as CustomNodeComponent,
        });
      } catch (e) {
        // Evitar errores de registro duplicado en Hot Reload
      }
    });

    const graph = new Graph({
      container: containerRef.current,
      autoResize: true,
      background: { color: "#f8fafc" },
      grid: {
        visible: true,
        type: 'mesh',
        size: 10,
        args: {
          color: '#e2e8f0', // slate-200
          thickness: 1,
        },
      },
      connecting: {
        snap: true,
        allowBlank: false,
        allowLoop: false,
        allowNode: true, // Permitir conectar de nodo a nodo directamente
        highlight: true,
        createEdge() {
          return new Shape.Edge({
            shape: 'edge',
            attrs: {
              line: {
                stroke: '#94a3b8',
                strokeWidth: 2,
              },
            },
            zIndex: -1,
          });
        },
      },
    } as any);

    // Activar el paneo/scroller en v3
    graph.use(
      new Scroller({
        enabled: true,
        pannable: true,
      })
    );

    // Escuchar cuando los nodos se mueven para actualizar el estado superior
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

    // Escuchar cuando el usuario conecta dos nodos
    graph.on("edge:connected", ({ edge }) => {
      if (onConnect) {
        onConnect({
          id: edge.id,
          source: edge.getSourceCellId(),
          target: edge.getTargetCellId(),
        });
      }
    });

    graphRef.current = graph;

    return () => {
      if (graph) {
        graph.dispose();
      }
    };
  }, []); // ¡IMPORTANTE! Array de dependencias vacío para no recrear el gráfico entero en cada render

  // Sincronizar Nodos
  useEffect(() => {
    const graph = graphRef.current;
    if (!graph) return;

    nodes.forEach((node) => {
      if (!node.type) return; // Evitar crash con nodos inválidos
      
      const shapeName = `custom-${node.type}`;
      // Solo añadimos el nodo si realmente hemos registrado su forma
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
                top: {
                  position: 'top',
                  attrs: {
                    circle: { r: 5, magnet: true, stroke: '#94a3b8', fill: '#fff', strokeWidth: 2 },
                  },
                },
                bottom: {
                  position: 'bottom',
                  attrs: {
                    circle: { r: 5, magnet: true, stroke: '#94a3b8', fill: '#fff', strokeWidth: 2 },
                  },
                },
                left: {
                  position: 'left',
                  attrs: {
                    circle: { r: 5, magnet: true, stroke: '#94a3b8', fill: '#fff', strokeWidth: 2 },
                  },
                },
                right: {
                  position: 'right',
                  attrs: {
                    circle: { r: 5, magnet: true, stroke: '#94a3b8', fill: '#fff', strokeWidth: 2 },
                  },
                },
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
          console.warn(`Error al añadir el nodo ${shapeName}:`, error);
        }
      }
    });
  }, [nodes, nodeTypes]);

  // Sincronizar Aristas
  useEffect(() => {
    const graph = graphRef.current;
    if (!graph) return;

    edges.forEach((edge) => {
      if (!graph.getCellById(edge.id)) {
        try {
          graph.addEdge({
            id: edge.id,
            source: edge.source,
            target: edge.target,
          });
        } catch (error) {
          console.warn(`Error al añadir la arista ${edge.id}:`, error);
        }
      }
    });
  }, [edges]);

  return (
    <>
      <PortalProvider />
      <div className="relative w-full h-full border border-slate-300 pointer-events-auto overflow-hidden">
        {/* Contenedor principal */}
        <div ref={containerRef} className="w-full h-full" />
      </div>
    </>
  );
}