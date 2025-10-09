import React, { FC, useContext } from "react";
import styled from "styled-components";
import { Button, LinkButton } from "../../../components/common";
import { IStyledProps } from "../../..";
import { PDFContext } from "../state";
import {
  setCurrentPage,
  setPDFPaginated,
  setZoomLevel,
} from "../state/actions";
import { useTranslation } from "../../../hooks/useTranslation";
import {
  DownloadPDFIcon,
  ResetZoomPDFIcon,
  TogglePaginationPDFIcon,
  ZoomInPDFIcon,
  ZoomOutPDFIcon,
} from "./icons";
import PDFPagination from "./PDFPagination";
import { DocViewerContext } from "../../../store/DocViewerProvider";

const PDFControls: FC = () => {
  const { t } = useTranslation();
  const { state: pdfState, dispatch } = useContext(PDFContext);

  const {
    mainState,
    paginated,
    zoomLevel,
    currentPage,
    numPages,
    zoomJump,
    defaultZoomLevel,
  } = pdfState;

  const { state: viewerState } = useContext(DocViewerContext);
  const { config } = viewerState;

  const currentDocument = mainState?.currentDocument || null;

  const pdfZoomOut = () => dispatch(setZoomLevel(zoomLevel - zoomJump));
  const pdfZoomIn = () => dispatch(setZoomLevel(zoomLevel + zoomJump));
  const pdfZoomReset = () => dispatch(setZoomLevel(defaultZoomLevel));
  const pdfTogglePaginated = () => dispatch(setPDFPaginated(!paginated));
  const pdfNextPage = () => dispatch(setCurrentPage(currentPage + 1));
  const pdfPrevPage = () => dispatch(setCurrentPage(currentPage - 1));

  const override = config?.pdfControls?.overrideComponent?.(
    pdfState,
    config.pdfControls,
    pdfZoomOut,
    pdfZoomIn,
    pdfZoomReset,
    pdfTogglePaginated,
    pdfNextPage,
    pdfPrevPage,
  );

  if (override) {
    return override;
  } else {
    return (
      <Container id="pdf-controls">
        {paginated && numPages > 1 && <PDFPagination />}

        {currentDocument?.fileData && (
          <DownloadButton
            id="pdf-download"
            href={currentDocument?.fileData as string}
            download={currentDocument?.fileName || currentDocument?.uri}
            title={t("downloadButtonLabel")}
          >
            <DownloadPDFIcon color="#000" size="65%" />
          </DownloadButton>
        )}

        <ControlButton id="pdf-zoom-out" onMouseDown={pdfZoomOut}>
          <ZoomOutPDFIcon color="#000" size="65%" />
        </ControlButton>

        <ControlButton id="pdf-zoom-in" onMouseDown={pdfZoomIn}>
          <ZoomInPDFIcon color="#000" size="65%" />
        </ControlButton>

        <ControlButton
          id="pdf-zoom-reset"
          onMouseDown={pdfZoomReset}
          disabled={zoomLevel === defaultZoomLevel}
        >
          <ResetZoomPDFIcon color="#000" size="65%" />
        </ControlButton>

        {numPages > 1 && (
          <ControlButton
            id="pdf-toggle-pagination"
            onMouseDown={pdfTogglePaginated}
          >
            <TogglePaginationPDFIcon
              color="#000"
              size="65%"
              reverse={paginated}
            />
          </ControlButton>
        )}
      </Container>
    );
  }
};

export default PDFControls;

const Container = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 1;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
  padding: 8px;
  background-color: ${(props: IStyledProps) => props.theme.tertiary};
  box-shadow: 0px 2px 3px #00000033;
  width: 100%;
  box-sizing: border-box;
  gap: 5px;

  @media (max-width: 768px) {
    padding: 6px;
    gap: 3px;
  }

  @media (max-width: 480px) {
    padding: 4px;
    gap: 2px;
  }
`;

const ControlButton = styled(Button)`
  width: min(30px, calc(100% / 6 - 10px));
  height: 30px;
  min-width: 25px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: min(25px, calc(100% / 6 - 8px));
    height: 25px;
  }

  @media (max-width: 480px) {
    width: min(22px, calc(100% / 6 - 6px));
    height: 22px;
  }
`;

const DownloadButton = styled(LinkButton)`
  width: min(30px, calc(100% / 6 - 10px));
  height: 30px;
  min-width: 25px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: min(25px, calc(100% / 6 - 8px));
    height: 25px;
  }

  @media (max-width: 480px) {
    width: min(22px, calc(100% / 6 - 6px));
    height: 22px;
  }
`;
