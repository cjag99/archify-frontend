// Page-level UI component that renders the AdminTable interface
"use client";
import { FC, useState } from "react";
import { useAdminTable } from "@/hooks/useAdminTable";
import { useParams, useRouter } from "next/navigation";
import { EmptyTable } from "./EmptyTable";
import { Button } from "@/components/atoms/Button";
import { Select } from "@/components/atoms/Select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Modal from "./Modal";
import { CodeLanguageForm } from "./CodeLanguageForm";
import { DeleteModal } from "./DeleteModal";
import { NoTableSelected } from "@/components/molecules/NoTableSelected";
import { ProfileView } from "./ProfileView";
import { ProjectView } from "./ProjectView";
import { PatternView } from "./PatternView";
import { ArchitectureView } from "./ArchitectureView";
import { PatternCodeView } from "./PatternCodeView";
import { CodeLanguageView } from "./CodeLanguageView";
import { ImageView } from "./ImageView";
import { CodeLanguage, Pattern, PatternCode, ImageType, User } from "@/core/types/models";
import { patternService } from "@/core/api/patterns.service";
import { dashboardResourceDetail, dashboardResourceNew } from "@/lib/routes";

export const AdminTable: FC = () => {
    const [modalType, setModalType] = useState<string | null>(null);

    const [selectedItem, setSelectedItem] = useState<Record<string, unknown> | null>(null);
    const [selectedViewItem, setSelectedViewItem] = useState<Record<string, unknown> | null>(null);
    const [patternOptions, setPatternOptions] = useState<Pattern[]>([]);
    const [selectedPatternId, setSelectedPatternId] = useState<string>("");
    const [patternOptionsLoading, setPatternOptionsLoading] = useState(false);
    
    const router = useRouter();
    const { tablename } = useParams();
    const { data, loading, error, currentTable, dropData, refreshData } = useAdminTable(tablename as string);
    
    type TableRow = { item: Record<string, unknown>; values: unknown[] };
    let rows: TableRow[] = [];


    if (!tablename) {
        return <NoTableSelected />;
    }

    if (loading) {
        return (
            <div className="p-8 max-w-7xl mx-auto space-y-6">
                <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-48 animate-pulse" />
                <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
            </div>
        );
    }

    const closeModal = () => {
        setModalType(null);
        setSelectedItem(null);
        setPatternOptions([]);
        setSelectedPatternId("");
    };

    const handleRowClick = (item: Record<string, unknown>) => {
        setSelectedViewItem(item);
        setModalType(null);
    };

    const openPatternCodeModal = async () => {
        setPatternOptionsLoading(true);
        try {
            const patterns = await patternService.getAll();
            const resolvedPatterns = Array.isArray(patterns) ? patterns : [];
            setPatternOptions(resolvedPatterns);
            if (resolvedPatterns.length === 0) {
                router.push(dashboardResourceNew("patterns"));
                return;
            }
            setSelectedPatternId(String(resolvedPatterns[0].id));
            setModalType("pattern-code-create");
        } catch (err) {
            console.error("Failed to load patterns", err);
            setPatternOptions([]);
            setSelectedPatternId("");
            router.push(dashboardResourceNew("patterns"));
        } finally {
            setPatternOptionsLoading(false);
        }
    };

    const handleCreate = async () => {
        if (currentTable === "images") {
            return;
        }

        if (["projects", "patterns", "architectures"].includes(currentTable || "")) {
            router.push(dashboardResourceNew(currentTable as string));
            return;
        }

        if (currentTable === "patterns-code") {
            await openPatternCodeModal();
            return;
        }

        setModalType(`${singularTable}-create`);
    };

    const closeSelectedView = () => {
        setSelectedViewItem(null);
    };

    const handleEdit = (item: Record<string, unknown>) => {
        if (!currentTable) return;

        const itemId = String((item as unknown as { id: string }).id);

        if (currentTable === "code-languages") {
            setSelectedItem(item);
            setModalType("code-language-edit");
            return;
        }

        if (currentTable === "users") {
            router.push(dashboardResourceDetail("users", itemId));
            return;
        }

        if (["projects", "patterns", "architectures"].includes(currentTable)) {
            router.push(dashboardResourceDetail(currentTable, itemId));
            return;
        }
    };

    const renderSelectedView = () => {
        if (!selectedViewItem || !currentTable) return null;

        switch (currentTable) {
            case "users":
                return <ProfileView user={selectedViewItem as unknown as User} hideActions />;
            case "projects":
                return <ProjectView projectId={String((selectedViewItem as unknown as { id: string }).id)} />;
            case "patterns":
                return <PatternView patternId={String((selectedViewItem as unknown as { id: string }).id)} hideActions />;
            case "architectures":
                return <ArchitectureView architectureId={String((selectedViewItem as unknown as { id: string }).id)} hideActions />;
            case "patterns-code":
                return <PatternCodeView patternCode={selectedViewItem as unknown as PatternCode} />;
            case "code-languages":
                return <CodeLanguageView codeLanguage={selectedViewItem as unknown as CodeLanguage} />;
            case "images":
                return <ImageView image={selectedViewItem as unknown as ImageType} />;
            default:
                return null;
        }
    };

    const renderGlobalModal = () => (
        <Modal isOpen={modalType !== null} onClose={closeModal}>
            {modalType === "code-language-create" && (
                <CodeLanguageForm
                    onCompleted={async (success) => {
                        closeModal();
                        if (success) {
                            await refreshData();
                        }
                    }}
                />
            )}
            {modalType === "pattern-code-create" && (
                <div className="space-y-4">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Select a pattern</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Choose a pattern to add code for, then continue to the code upload step.
                        </p>
                    </div>
                    <Select
                        label="Pattern"
                        value={selectedPatternId}
                        onChange={(event) => setSelectedPatternId(event.target.value)}
                        options={patternOptions.map((pattern) => ({
                            value: pattern.id,
                            label: pattern.name,
                        }))}
                    />
                    {patternOptionsLoading && <p className="text-sm text-slate-500">Loading patterns...</p>}
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="secondary"
                            onClick={closeModal}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                const selectedPattern = patternOptions.find((pattern) => String(pattern.id) === selectedPatternId);
                                if (!selectedPattern) {
                                    return;
                                }
                                closeModal();
                                router.push(
                                    `/dashboard/patterns/new?patternId=${encodeURIComponent(String(selectedPattern.id))}&patternName=${encodeURIComponent(selectedPattern.name)}`
                                );
                            }}
                            disabled={!selectedPatternId}
                        >
                            Continue
                        </Button>
                    </div>
                </div>
            )}
            {modalType === "code-language-edit" && selectedItem && (
                <CodeLanguageForm
                    codeLanguage={selectedItem as unknown as CodeLanguage}
                    onCompleted={async (success) => {
                        closeModal();
                        if (success) {
                            await refreshData();
                        }
                    }}
                />
            )}
            {modalType === `${singularTable}-delete` && selectedItem && (
                <DeleteModal
                    id={String(selectedItem.id)}
                    onConfirm={async () => {
                        await dropData(selectedItem.id as string | number);
                        closeModal();
                    }}
                    onClose={closeModal}
                />
            )}
        </Modal>
    );


    const singularTable = currentTable 
        ? currentTable.toLowerCase().replace(/s$/, "").replace("_", "-") 
        : "";
    
    if (error) return <EmptyTable />;
    
    if (!data || data.length === 0) {
        return (
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 mb-6 md:mb-8">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 dark:text-slate-100 capitalize mb-1 md:mb-2 truncate">
                            {`${currentTable} Directory`}
                        </h1>
                        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                            View and manage {currentTable} records in the system.
                        </p>
                    </div>
                </div>
                <EmptyTable 
                    label={singularTable}
                    onClick={currentTable === "images" ? undefined : handleCreate}
                />
                {renderGlobalModal()}
            </div>
        );
    }

    rows = (data as Record<string, unknown>[]).map((item) => ({
        item,
        values: Object.values(item),
    }));

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 mb-6 md:mb-8">
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 dark:text-slate-100 capitalize mb-1 md:mb-2 truncate">
                        {`${currentTable} Directory`}
                    </h1>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                        View and manage {currentTable} records in the system.
                    </p>
                </div>
                
                {currentTable !== "images" && (
                    <Button
                        onClick={handleCreate}
                        variant="success"
                        className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-start shrink-0"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="hidden md:inline">New {singularTable.replace("-", " ")}</span>
                        <span className="md:hidden">New</span>
                    </Button>
                )}
            </div>

            {selectedViewItem && (
                <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Detail view</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Showing details for the selected {singularTable.replace("-", " ")}.</p>
                        </div>
                        <Button variant="secondary" onClick={closeSelectedView} className="w-full sm:w-auto">
                            Close view
                        </Button>
                    </div>
                    {renderSelectedView()}
                </div>
            )}

            {renderGlobalModal()}

            <div className="space-y-2 md:space-y-3">
                <ul className="space-y-2 md:space-y-3">
                    {rows.map((row: TableRow, i: number) => {

                        let displayField = "name";
                        if (currentTable === "images") displayField = "file_name";
                        else if (currentTable === "users") displayField = "username";
                        
                        const itemName = (row.item[displayField] as string) || `Item ${i + 1}`;

                        return (
                            <li
                                key={i}
                                onClick={() => handleRowClick(row.item)}
                                className="group flex items-center justify-between px-4 md:px-6 py-3 md:py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                            >
                                <span className="text-sm md:text-base font-medium text-slate-700 dark:text-slate-300 truncate flex-1 pr-4">
                                    {itemName}
                                </span>

                                <div className="flex items-center gap-2 shrink-0">
                                    {}
                                    {!["patterns-code", "images"].includes(currentTable || "") && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(row.item);
                                            }}
                                            className="md:hidden p-1.5 text-slate-500 hover:text-brand hover:bg-brand/10 dark:hover:bg-brand/20 rounded-lg transition-all active:scale-95"
                                            title="Edit"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedItem(row.item);
                                            setModalType(`${singularTable}-delete`);
                                        }}
                                        className="md:hidden p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all active:scale-95"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    {}
                                    {!["patterns-code", "images"].includes(currentTable || "") && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(row.item);
                                            }}
                                            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-lg transition-all active:scale-95 shrink-0"
                                        >
                                            <Pencil className="w-4 h-4" />
                                            Edit
                                        </button>
                                    )}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedItem(row.item);
                                            setModalType(`${singularTable}-delete`);
                                        }}
                                        className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/40 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 font-semibold text-xs rounded-lg transition-all active:scale-95 shrink-0"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

