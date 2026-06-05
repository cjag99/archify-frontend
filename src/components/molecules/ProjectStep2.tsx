// Composite UI component used by views and forms for ProjectStep2
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/molecules/Input";
import { Select } from "@/components/atoms/Select";
import { useArchitecture } from "@/hooks/useArchitecture";
import { architectureList } from "@/core/nodeList/architectureList";
import { AlertCircle } from "lucide-react";

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

interface NodeNameMap {
  [nodeType: string]: string;
}

interface ProjectStep2Props {
  projectName: string;
  projectDescription: string;
  logo_id?: string;
  initialArchitectureId?: string;
  initialSchema?: { nodes: CanvasNodeData[]; edges: CanvasEdgeData[]; architecture_id?: string };
  onBack: () => void;
  onFinish: (
    architecture_id: string,
    nodeNameMap: NodeNameMap,
    schema: { nodes: CanvasNodeData[]; edges: CanvasEdgeData[] }
  ) => Promise<void> | void;
}

export const ProjectStep2: React.FC<ProjectStep2Props> = ({
  projectName,
  projectDescription,
  logo_id,
  initialArchitectureId,
  initialSchema,
  onBack,
  onFinish,
}) => {
  const router = useRouter();
  const { architectures, loading: architecturesLoading } = useArchitecture();


  const effectiveInitialArchId = initialArchitectureId || initialSchema?.architecture_id;
  const [selectedArchitectureId, setSelectedArchitectureId] = useState<string>(effectiveInitialArchId || "");
  const [selectedArchitecture, setSelectedArchitecture] = useState<any>(null);
  const [nodeNameMap, setNodeNameMap] = useState<NodeNameMap>({});
  const [isLoading, setIsLoading] = useState(false);


  const getArchitectureNodes = () => {
    if (!selectedArchitecture?.base_structure) return [];
    
    const nodes = (selectedArchitecture.base_structure as any).nodes || [];
    return nodes.filter((node: CanvasNodeData) => node.type !== "user");
  };

  const architectureNodes = getArchitectureNodes();

  useEffect(() => {
    if (selectedArchitectureId && architectures) {
      const arch = architectures.find((a) => a.id === selectedArchitectureId);
      setSelectedArchitecture(arch);
      



      if (initialSchema && selectedArchitectureId === effectiveInitialArchId) {
        const initialNodeMap: NodeNameMap = {};
        (initialSchema.nodes || []).forEach((node: CanvasNodeData) => {
          if (node.type !== "user") {
            initialNodeMap[node.type || node.id] = (node.data?.label as string) || "";
          }
        });
        setNodeNameMap(initialNodeMap);
      } else if (arch?.base_structure) {

        const nodes = (arch.base_structure as any).nodes || [];
        const initialNodeMap: NodeNameMap = {};
        nodes.forEach((node: CanvasNodeData) => {
          if (node.type !== "user") {
            initialNodeMap[node.type || node.id] = (node.data?.label as string) || architectureList.find(n => n.type === node.type)?.label || node.id;
          }
        });
        setNodeNameMap(initialNodeMap);
      }
    }
  }, [selectedArchitectureId, architectures, effectiveInitialArchId, initialSchema]);

  const handleNodeNameChange = (nodeType: string, newName: string) => {
    setNodeNameMap((prev) => ({
      ...prev,
      [nodeType]: newName,
    }));
  };

  const handleFinish = async () => {
    if (!selectedArchitectureId) return;

    setIsLoading(true);
    try {

      if (selectedArchitecture?.base_structure) {
        const baseStructure = selectedArchitecture.base_structure as any;
        const updatedNodes: CanvasNodeData[] = (baseStructure.nodes || []).map((node: CanvasNodeData) => {
          if (node.type !== "user" && nodeNameMap[node.type || node.id]) {
            return {
              ...node,
              data: {
                ...node.data,
                label: nodeNameMap[node.type || node.id],
              },
            };
          }
          return node;
        });

        const schema = {
          nodes: updatedNodes,
          edges: baseStructure.edges || [],
          architecture_id: selectedArchitectureId,
        };

        await onFinish(selectedArchitectureId, nodeNameMap, schema);

        router.push("/dashboard/projects");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getNodeDescription = (nodeType: string): string => {
    const nodeItem = architectureList.find((item) => item.type === nodeType);
    return nodeItem?.description || "No description available";
  };

  const architectureOptions = [
    { value: "", label: "Select an architecture" },
    ...architectures.map((arch) => ({
      value: arch.id,
      label: arch.name,
    })),
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-slate-100">Step 2: Select Architecture</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              Choose an architecture and customize the node names for your project <strong>{projectName}</strong>.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            <p className="font-semibold text-slate-900 dark:text-slate-100">Project Info</p>
            <p className="text-xs mt-1 dark:text-slate-400">{projectDescription}</p>
          </div>
        </div>
      </div>

      {architecturesLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-500">Loading architectures...</p>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
            <Select
              label="Architecture"
              value={selectedArchitectureId}
              onChange={(e) => setSelectedArchitectureId(e.target.value)}
              options={architectureOptions}
            />
          </div>

          {selectedArchitectureId && architectureNodes.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-slate-950 dark:text-slate-100">Customize Node Names</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">(Optional - keep default names if you prefer)</p>
              </div>

              <div className="space-y-4">
                {architectureNodes.map((node: CanvasNodeData) => {
                  const nodeType = node.type || node.id;
                  const nodeInfo = architectureList.find((item) => item.type === nodeType);

                  return (
                    <div key={nodeType} className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0">
                        {nodeInfo?.icon}
                      </div>
                      <div className="flex-grow space-y-1">
                        <div className="flex items-center gap-2">
                          <label className="block text-sm font-semibold text-slate-700">
                            {nodeInfo?.label || nodeType}
                          </label>
                          <div className="group relative cursor-help">
                            <AlertCircle size={16} className="text-slate-400 hover:text-slate-600 transition-colors" />
                            <div className="invisible group-hover:visible absolute left-0 top-full mt-1 z-10 w-48 bg-slate-900 text-white text-xs rounded-lg p-2 shadow-lg">
                              {getNodeDescription(nodeType)}
                            </div>
                          </div>
                        </div>
                        <Input
                          type="text"
                          value={nodeNameMap[nodeType] || (node.data?.label as string) || nodeInfo?.label || ""}
                          onChange={(e) => handleNodeNameChange(nodeType, e.target.value)}
                          placeholder={nodeInfo?.label || "Node name"}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <Button variant="secondary" onClick={onBack} disabled={isLoading}>
          Back to Step 1
        </Button>
        <Button
          variant="success"
          onClick={handleFinish}
          disabled={!selectedArchitectureId || architectureNodes.length === 0 || isLoading}
        >
          {isLoading ? "Finishing..." : "Finish Project Creation"}
        </Button>
      </div>
    </div>
  );
};

