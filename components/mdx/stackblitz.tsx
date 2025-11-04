"use client";

import React from "react";

interface StackBlitzProps {
  id: string;
  file?: string;
  view?: "preview" | "editor" | "both";
}

const StackBlitz: React.FC<StackBlitzProps> = ({
  id,
  file = "index.html",
  view = "preview",
}) => {
  const embedUrl = `https://stackblitz.com/edit/${id}?embed=1&file=${file}&view=${view}`;

  return (
    <>
      <style>{`
        .stackblitz-embed {
          height: 400px;
        }
        @media (min-width: 768px) {
          .stackblitz-embed {
            height: 600px;
          }
        }
        @media (min-width: 1024px) {
          .stackblitz-embed {
            height: 700px;
          }
        }
      `}</style>
      <div className="w-full rounded-lg overflow-hidden">
        <iframe
          src={embedUrl}
          className="w-full border-0 stackblitz-embed"
          allowFullScreen
          title="StackBlitz Embed"
        />
      </div>
    </>
  );
};

export default StackBlitz;
