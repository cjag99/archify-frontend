// Composite UI component used by views and forms for PatternStep2
"use client";

import React, { useCallback, useState } from "react";
import { ImageType } from "@/core/types/models";
import SchemaCanvas from "@/components/organisms/SchemaCanvas";
import NodeSidebar from "@/components/organisms/NodeSidebar";
import { Button } from "../atoms/Button";
import { FileInput } from "./FileInput";
import { useImage } from "@/hooks/useImage";
import { usePatterns } from "@/hooks/usePattern";
import { UserNode } from "./diagramNodes/UserNode";
import { patternList } from "@/core/nodeList/patternList";
import { SingletonNode } from "./diagramNodes/SingletonNode";

interface CanvasNodeData {
  id: string;
  type?: string;
  position?: { x: number; y: number };
  data?: Record<string, unknown>;
}

interface CanvasEdgeData {
  id: string;
  source: string;
  target: string;
}

interface ConnectionPayload {
  id: string;
  source: string;
  target: string;
}

interface PatternStep2Props {
  patternName: string;
  patternDescription: string;
  graphicType: number;
  mode?: "create" | "edit";
  patternId?: string;
  initialNodes?: CanvasNodeData[];
  initialEdges?: CanvasEdgeData[];
  initialImageId?: string | null;
  onBack: () => void;
  onFinish: (patternId: string) => void;
}

export const PatternStep2: React.FC<PatternStep2Props> = ({
  patternName,
  patternDescription,
  graphicType,
  mode = "create",
  patternId,
  initialNodes = [],
  initialEdges = [],
  initialImageId = null,
  onBack,
  onFinish,
}) => {
 
  const [nodes, setNodes] = useState<CanvasNodeData[]>(initialNodes);
  const [edges, setEdges] = useState<CanvasEdgeData[]>(initialEdges);
  const [image, setImage] = useState<ImageType | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  const { createImage } = useImage();
  const { createPattern, updatePattern } = usePatterns();

  const patternNodeTypes = {
    user: UserNode,
    singleton: SingletonNode,
  };

  const handleNodesChange = useCallback((updatedNodes: CanvasNodeData[]) => {
    setNodes(updatedNodes);
  }, []);

  const handleEdgesChange = useCallback((updatedEdges: CanvasEdgeData[]) => {
    setEdges(updatedEdges);
  }, []);

  const handleAddNode = useCallback((type: string, label: string) => {
    const id = crypto.randomUUID();
    const newNode: CanvasNodeData = {
      id,
      type,
      position: {
        x: 220 + Math.random() * 120,
        y: 180 + Math.random() * 120,
      },
      data: { label },
    };
    setNodes((current) => current.concat(newNode));
  }, []);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow") || event.dataTransfer.getData("text/plain");
      if (!type) return;

      patternList.find((node) => node.type === type);
      const rect = event.currentTarget.getBoundingClientRect();
      const clientX = event.clientX - rect.left;
      const clientY = event.clientY - rect.top;

      const id = crypto.randomUUID();
      const newNode: CanvasNodeData = {
        id,
        type,
        position: { x: clientX - 48, y: clientY - 48 },
      };

      setNodes((current) => current.concat(newNode));
    },
    []
  );

 const onConnect = useCallback((connection: ConnectionPayload) => {
    setEdges((currentEdges) => {
      const exists = currentEdges.some(
        (e) => e.source === connection.source && e.target === connection.target
      );
      if (exists) return currentEdges;

      return currentEdges.concat({
        id: connection.id || `edge-${crypto.randomUUID()}`,
        source: connection.source,
        target: connection.target,
      });
    });
  }, []);

  const uploadImage = (file: File | null) => {
    if (!file) return;

    void (async () => {
      setUploadError(null);
      setImage(null);
      setIsUploadingImage(true);

      try {
        const result = await createImage(file, "pattern_graphic");
        if (!result?.id) {
          setUploadError("Image upload failed. Please try again.");
          return;
        }
        setImage(result);
      } catch {
        setUploadError("Image upload failed. Please try again.");
      } finally {
        setIsUploadingImage(false);
      }
    })();
  };

  const canSubmit =
    graphicType === 1
      ? Boolean(image || initialImageId)
      : true;


  const handleStep3 = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) {
      setUploadError(
        graphicType === 1
          ? "You must upload an image before continuing."
          : "You must create at least one node in the editor before continuing."
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
      image_id: image ? image.id : initialImageId,
    };

    try {
      const savedPattern =
        mode === "edit" && patternId
          ? await updatePattern(patternId, finalPayload)
          : await createPattern(finalPayload);

      if (mode !== "edit" && !savedPattern?.id) {
        throw new Error("The pattern was saved but no ID was returned.");
      }
      onFinish(savedPattern?.id || patternId || "");
    } catch (err) {
      console.error("Pattern save failed:", err);
      setUploadError("Pattern save failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleStep3} className="space-y-6">
      {graphicType === 1 ? (
        <>
          <FileInput label="Graphic" onChange={uploadImage} accept="image/*" />
          {initialImageId && !image && (
            <p className="text-sm text-slate-500">The current image will remain unless you upload a new one.</p>
          )}
          {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
          {isUploadingImage && <p className="text-sm text-gray-500">Uploading image...</p>}
        </>
      ) : graphicType === 2 ? (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
            <h2 className="text-2xl font-bold text-slate-950 dark:text-slate-100">Step 2: Design your pattern schema</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Add nodes and connections to define the pattern structure.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row h-[calc(100vh-200px)] md:h-[calc(100vh-340px)] gap-4 sm:gap-6">
            <NodeSidebar
              title="Schema Nodes"
              subtitle="Click or drag to add a node to the canvas."
              items={patternList}
              onAddNode={handleAddNode}
            />

            <div
              className="grow rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden min-h-100 dark:border-slate-800 dark:bg-slate-900/50"
              onDragOver={onDragOver}
              onDrop={onDrop}
            >
              <SchemaCanvas
                nodes={nodes}
                edges={edges}
                nodeTypes={patternNodeTypes}
                onNodesChange={handleNodesChange}
                onEdgesChange={handleEdgesChange}
                onConnect={onConnect}
              />
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex gap-4 pt-4">
        <Button variant="outline" type="button" onClick={onBack}>
          Back
        </Button>
        <Button variant="success" type="submit" disabled={!canSubmit || isUploadingImage}>
          Continue
        </Button>
      </div>
    </form>
  );
};

