"use client";

import { ImageType } from "@/core/types/models";
import React, { useCallback, useState } from "react";
import {
  Connection,
  Node,
  Edge,
  addEdge,
  reconnectEdge,
  useNodesState,
  useEdgesState,
  OnReconnect,
} from "@xyflow/react";
import SchemaCanvas from "@/components/organisms/SchemaCanvas";
import NodeSidebar from "@/components/organisms/NodeSidebar";
import { Button } from "../atoms/Button";
import { FileInput } from "./FileInput";
import { useImage } from "@/hooks/useImage";
import { usePatterns } from "@/hooks/usePattern";
import { architectureList } from "@/core/nodeList/architectureList";
import { MVCViewNode } from "./diagramNodes/MVCViewNode";
import { MVCModelNode } from "./diagramNodes/MVCModelNode";
import { MVCControllerNode } from "./diagramNodes/MVCControllerNode";
import { CleanEntityNode } from "./diagramNodes/CleanEntityNode";
import { CleanUseCaseNode } from "./diagramNodes/CleanUseCaseNode";
import { CleanAdapterNode } from "./diagramNodes/CleanAdapterNode";
import { CleanFrameworkNode } from "./diagramNodes/CleanFrameworkNode";
import { HexagonalDomainNode } from "./diagramNodes/HexagonalDomainNode";
import { HexagonalApplicationNode } from "./diagramNodes/HexagonalApplicationNode";
import { HexagonalAdapterNode } from "./diagramNodes/HexagonalAdapterNode";
import { UserNode } from "./diagramNodes/UserNode";

interface PatternStep2Props {
    patternName: string;
    patternDescription: string;
    graphicType: number;
    onBack: () => void;
    onFinish: (patternId: string) => void;
};

export const PatternStep2: React.FC<PatternStep2Props> = ({
    patternName,
    patternDescription,
    graphicType,
    onBack,
    onFinish,
}) => {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [image, setImage] = useState<ImageType | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const { createImage } = useImage();
    const { createPattern } = usePatterns();

    const architectureNodeTypes = {
      user: UserNode,
      "mvc-view": MVCViewNode,
      "mvc-model": MVCModelNode,
      "mvc-controller": MVCControllerNode,
      "clean-entity": CleanEntityNode,
      "clean-usecase": CleanUseCaseNode,
      "clean-adapter": CleanAdapterNode,
      "clean-framework": CleanFrameworkNode,
      "hex-domain": HexagonalDomainNode,
      "hex-application": HexagonalApplicationNode,
      "hex-adapter": HexagonalAdapterNode,
    };

    const handleAddNode = useCallback(
      (type: string, label: string) => {
        const id = crypto.randomUUID();
        setNodes((current) =>
          current.concat({
            id,
            type,
            position: {
              x: 220 + Math.random() * 120,
              y: 180 + Math.random() * 120,
            },
            data: { label },
          })
        );
      },
      [setNodes]
    );

    const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback(
      (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const type = event.dataTransfer.getData("application/reactflow");
        if (!type) return;

        const item = architectureList.find((node) => node.type === type);
        const label = item ? item.label : "Component";
        const position = {
          x: event.clientX - 120,
          y: event.clientY - 120,
        };

        const id = crypto.randomUUID();
        setNodes((current) =>
          current.concat({
            id,
            type,
            position,
            data: { label },
          })
        );
      },
      [setNodes]
    );

    const onConnect = useCallback(
      (connection: Connection) => setEdges((current) => addEdge(connection, current)),
      [setEdges]
    );

    const onReconnect = useCallback<OnReconnect>(
      (oldEdge, connection) => setEdges((current) => reconnectEdge(oldEdge, connection, current)),
      [setEdges]
    );

    const uploadImage = (file: File | null) => {
        if (!file) return;

        void (async () => {
            setUploadError(null);
            setImage(null);
            setIsUploadingImage(true);

            try {
                const result = await createImage(file, "pattern_graphic");
                if (!result?.id) {
                    setUploadError("No se pudo subir la imagen. Intenta de nuevo.");
                    return;
                }
                setImage(result);
            } finally {
                setIsUploadingImage(false);
            }
        })();
    };
    
    const canSubmit =
      graphicType === 1
        ? Boolean(image)
        : graphicType === 2
        ? nodes.length > 0
        : true;

    const handleStep3 = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!canSubmit) {
            setUploadError(
              graphicType === 1
                ? "Debes subir una imagen antes de continuar."
                : "Debes crear al menos un nodo en el editor antes de continuar."
            );
            return;
        }

        const finalPayload = {
            name: patternName,
            description: patternDescription,
            base_structure: {
                nodes,
                edges,
            } as unknown as JSON,
            image_id: image ? image.id : null,
        };
        console.log("Final Pattern Payload:", finalPayload);

        try {
            const createdPattern = await createPattern(finalPayload);
            if (!createdPattern?.id) {
                throw new Error("El patrón se creó pero no se recibió el ID.");
            }
            onFinish(createdPattern.id);
        } catch (err) {
            console.error("Pattern creation failed:", err);
            setUploadError("No se pudo crear el patrón. Intenta de nuevo.");
        }
    };


    return (
        <form onSubmit={handleStep3} className="space-y-6">
            {graphicType === 1 ? (
                <>
                    <FileInput label="Graphic" onChange={uploadImage} accept="image/*" />
                    {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                    {isUploadingImage && <p className="text-sm text-gray-500">Subiendo imagen...</p>}
                </>
            ) : graphicType === 2 ? (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-slate-900">Step 2: Design your pattern schema</h2>
                    <p className="mt-2 text-sm text-slate-500">
                      Añade nodos y conexiones para definir la estructura del patrón.
                    </p>
                  </div>

                  <div className="flex h-[calc(100vh-340px)] gap-6">
                    <NodeSidebar
                      title="Schema Nodes"
                      subtitle="Haz click o arrastra para añadir un nodo al lienzo."
                      items={architectureList}
                      onAddNode={handleAddNode}
                    />

                    <div
                      className="grow rounded-3xl border border-slate-200 bg-white shadow-sm"
                      onDragOver={onDragOver}
                      onDrop={onDrop}
                    >
                      <SchemaCanvas
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={architectureNodeTypes}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onReconnect={onReconnect}
                      />
                    </div>
                  </div>
                </div>
            ) : null}
            <Button variant="outline" type="button" onClick={onBack}>
                Back
            </Button>
            <Button variant="success" type="submit" disabled={!canSubmit || isUploadingImage}>
                Continue
            </Button>
        </form>
        );
};