import React, { useContext } from "react";
import { DocViewerContext } from "../store/DocViewerProvider";
import { updateCurrentDocument } from "../store/actions";
import styled from "styled-components";
import { useTranslation } from "../hooks/useTranslation";

export const DocumentSelector: React.FC = () => {
  const { state, dispatch } = useContext(DocViewerContext);
  const { documents, currentDocument } = state;
  const { t } = useTranslation();

  if (!documents || documents.length <= 1) return null;

  const handleDocumentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDocIndex = parseInt(e.target.value, 10);
    const selectedDoc = documents[selectedDocIndex];
    if (selectedDoc) {
      dispatch(updateCurrentDocument(selectedDoc));
    }
  };

  // Find current document index
  const currentDocIndex = documents.findIndex(
    (doc) => doc.uri === currentDocument?.uri,
  );

  const selectLabel = t("selectDocument");

  return (
    <SelectorContainer>
      <label htmlFor="document-selector">
        <StyledSelect
          id="document-selector"
          value={currentDocIndex}
          onChange={handleDocumentChange}
          aria-label={selectLabel}
          title={selectLabel}
        >
          {documents.map((doc, index) => (
            <StyledOption key={`${doc.uri}-${index}`} value={index}>
              {doc.fileName || t("documentNumber", { number: index + 1 })}
            </StyledOption>
          ))}
        </StyledSelect>
      </label>
    </SelectorContainer>
  );
};

const SelectorContainer = styled.div`
  margin: 10px 0;
  display: flex;
  justify-content: center;
`;

const StyledSelect = styled.select`
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #ccc;
  min-width: 200px;
  cursor: pointer;
  font-size: 14px;
`;

const StyledOption = styled.option`
  padding: 8px;
  font-size: 14px;
`;
