import React, { useRef, useState } from "react";
import DocViewer from "./DocViewer";
import { DocViewerRenderers } from "./renderers";

import pdfFile from "./exampleFiles/pdf-file.pdf";
import pdfMultiplePagesFile from "./exampleFiles/pdf-multiple-pages-file.pdf";
import pngFile from "./exampleFiles/png-image.png?url";
import csvFile from "./exampleFiles/csv-file.csv?url";
import epsFile from "./exampleFiles/eps-file.eps?url";
import webpFile from "./exampleFiles/webp-file.webp?url";

import { DocViewerRef, IDocument, IPdfControlsOverride } from ".";

export default {
  title: "DocViewer",
};

const docs: IDocument[] = [
  { uri: pdfFile },
  { uri: pngFile },
  { uri: csvFile },
  { uri: pdfMultiplePagesFile },
  { uri: webpFile },
];

export const Default = () => (
  <DocViewer
    documents={docs}
    initialActiveDocument={docs[1]}
    config={{
      noRenderer: {
        overrideComponent: ({ document, fileName }) => {
          const fileText = fileName || document?.fileType || "";
          console.log(document);
          if (fileText) {
            return <div>no renderer for {fileText}</div>;
          }
          return <div>no renderer</div>;
        },
      },
      loadingRenderer: {
        overrideComponent: ({ document, fileName }) => {
          const fileText = fileName || document?.fileType || "";
          if (fileText) {
            return <div>loading ({fileText})</div>;
          }
          return <div>loading</div>;
        },
      },
      csvDelimiter: ",",
      pdfZoom: {
        defaultZoom: 1.1,
        zoomJump: 0.2,
      },
      pdfVerticalScrollByDefault: true,
    }}
    language="pl"
  />
);

export const WithPDFInput = () => {
  const [selectedDocs, setSelectedDocs] = useState<File[]>([]);

  return (
    <>
      <input
        type="file"
        accept=".pdf"
        multiple
        onChange={(el) =>
          el.target.files?.length &&
          setSelectedDocs(Array.from(el.target.files))
        }
      />
      <DocViewer
        documents={selectedDocs.map((file) => ({
          uri: window.URL.createObjectURL(file),
          fileName: file.name,
        }))}
        pluginRenderers={DocViewerRenderers}
      />
    </>
  );
};

export const ManualNextPrevNavigation = () => {
  const [activeDocument, setActiveDocument] = useState(docs[0]);

  const handleDocumentChange = (document: IDocument) => {
    setActiveDocument(document);
  };

  return (
    <>
      <DocViewer
        documents={docs}
        activeDocument={activeDocument}
        onDocumentChange={handleDocumentChange}
      />
    </>
  );
};

export const WithRef = () => {
  const docViewerRef = useRef<DocViewerRef>(null);

  return (
    <>
      <div>
        <button onClick={() => docViewerRef?.current?.prev()}>
          Prev Document By Ref
        </button>
        <button onClick={() => docViewerRef?.current?.next()}>
          Next Document By Ref
        </button>
      </div>
      <DocViewer
        ref={docViewerRef}
        documents={docs}
        config={{ header: { disableHeader: true } }}
      />
    </>
  );
};

export const NoRenderType = () => {
  const docs = [{ uri: epsFile, fileType: "application/postscript" }];

  return (
    <DocViewer
      documents={docs}
      initialActiveDocument={docs[0]}
      pluginRenderers={DocViewerRenderers}
      language="en"
    />
  );
};

export const CustomPDFControls = () => {
  const [selectedDocs, setSelectedDocs] = useState<File[]>([]);

  const customPDFControls: IPdfControlsOverride = (
    state,
    config,
    pdfZoomOut,
    pdfZoomIn,
    pdfZoomReset,
    pdfTogglePaginated,
    pdfNextPage,
    pdfPrevPage,
  ) => {
    return (
      <div
        style={{
          display: "flex",
          gap: "8px",
          padding: "8px",
          background: "#eee",
          position: "sticky",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      >
        <button onClick={pdfZoomOut}>Zoom Out</button>
        <span>Zoom: {state.zoomLevel?.toFixed(2)}</span>
        <button onClick={pdfZoomIn}>Zoom In</button>
        <button onClick={pdfZoomReset}>Reset Zoom</button>
        <button onClick={pdfTogglePaginated}>Toggle Pagination</button>
        <span>Paginated: {state.paginated ? "Yes" : "No"}</span>
        {state.paginated && state.numPages > 1 && (
          <>
            <button onClick={pdfPrevPage} disabled={state.currentPage <= 1}>
              Prev Page
            </button>
            <span>
              {state.currentPage} / {state.numPages}
            </span>
            <button
              onClick={pdfNextPage}
              disabled={state.currentPage >= state.numPages}
            >
              Next Page
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <input
        type="file"
        accept=".pdf"
        multiple
        onChange={(el) =>
          el.target.files?.length &&
          setSelectedDocs(Array.from(el.target.files))
        }
      />
      <DocViewer
        documents={selectedDocs.map((file) => ({
          uri: window.URL.createObjectURL(file),
          fileName: file.name,
        }))}
        config={{
          pdfControls: {
            overrideComponent: customPDFControls,
          },
        }}
      />
    </>
  );
};
