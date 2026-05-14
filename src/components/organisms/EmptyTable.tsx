"use client";

import { FC } from "react";
import { Database } from "lucide-react";

export const EmptyTable: FC = () => {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <Database className="w-24 h-24 text-gray-400" />
                    <h3 className="mt-2 text-lg font-semibold text-gray-900">No features yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new feature.</p>
                </div>
            </div>
        </div>
    );
}