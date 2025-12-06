"use client";

import { useEffect, useRef, useContext } from "react";
import editorTools from "@/components/EditPress/editorTools";

import { PressContext } from "@/context/PressContext";

export default function AddPressEditor({ preview }) {
  const { pressData, setPressData } = useContext(PressContext);
  const editorRef = useRef(null);

  useEffect(() => {
    let editorInstance;

    const initEditor = async () => {
      if (typeof window === "undefined") return;

      const EditorJS = (await import("@editorjs/editorjs")).default;

      if (!editorRef.current) {
        editorInstance = new EditorJS({
          holder: "editorjs",
          placeholder: "Write your awesome story here...",
          tools: editorTools,
          data: pressData.content || {},
          onChange: async () => {
            try {
              const savedData = await editorInstance.save();
              setPressData((prev) => ({
                ...prev,
                content: savedData,
                image: prev.image || preview || "/banner.png",
              }));
            } catch (err) {
              console.error("EditorJS save error:", err);
            }
          },
        });

        editorRef.current = editorInstance;
      }
    };

    initEditor();
  }, [preview, setPressData, pressData.content]);

  return (
    <div
      id='editorjs'
      className='prose lg:prose-xl mt-6 text-gray-800 border-b border-gray-300 placeholder:text-black !pb-4 '
    />
  );
}
