import React, { useEffect } from "react";
import { css } from "emotion";
import { i18n } from "@webiny/app/i18n";
import { useDialog } from "@webiny/app-admin/hooks/useDialog";
import { ButtonIcon, ButtonSecondary, CopyButton } from "@webiny/ui/Button";
import { Typography } from "@webiny/ui/Typography";
import { Cell, Grid } from "@webiny/ui/Grid";
import { useSnackbar } from "@webiny/app-admin/hooks/useSnackbar";
import { CircularProgress } from "@webiny/ui/Progress";

import { usePageBuilder } from "~/hooks/usePageBuilder";
import { ReactComponent as FileDownloadIcon } from "~/editor/assets/icons/file_download_black_24dp.svg";
import ExportTemplateLoadingDialogContent from "./ExportTemplateLoadingDialogContent";
import useExportTemplate from "./useExportTemplate";

const t = i18n.ns("app-page-builder/editor/plugins/defaultBar/exportTemplateButton");

const confirmationMessageStyles = css`
    width: 600px;
`;

const linkWrapper = css`
    display: flex;
    background-color: var(--mdc-theme-background);

    & .link-text {
        padding: 8px 0 8px 16px;
        width: 100%;
        overflow: hidden;
    }
`;

const gridClass = css`
    &.mdc-layout-grid {
        padding-top: 0;
        padding-bottom: 0;
    }
`;

const spinnerWrapper = css`
    position: relative;
    width: 100%;
    height: 180px;
`;

export interface ExportTemplatesDialogProps {
    ids?: string[];
    where?: Record<string, any>;
    sort?: string;
    search: { query: string };
}

const ExportTemplateLoadingDialogMessage: React.FC<ExportTemplatesDialogProps> = props => {
    const { exportTemplate } = useExportTemplate();
    const {
        exportPageData: { revisionType }
    } = usePageBuilder();

    useEffect(() => {
        exportTemplate({
            variables: {
                revisionType,
                ...props
            }
        });
    }, []);

    return (
        <div className={confirmationMessageStyles}>
            <div className={spinnerWrapper}>
                <CircularProgress label={t`Preparing your export...`} />
            </div>
        </div>
    );
};

interface ExportTemplateDialogProps {
    exportUrl: string;
}

const ExportTemplateDialogMessage: React.FC<ExportTemplateDialogProps> = ({ exportUrl }) => {
    const { showSnackbar } = useSnackbar();

    return (
        <div className={confirmationMessageStyles}>
            <Grid style={{ paddingTop: 0 }}>
                <Cell span={12}>
                    <Typography use={"subtitle1"}>{t`Copy the export URL:`}</Typography>
                </Cell>
                <Cell span={12}>
                    <div className={linkWrapper}>
                        <Typography
                            use={"body2"}
                            className={"link-text"}
                            data-testid={"pb-templates-export-dialog-export-url"}
                        >
                            {exportUrl}
                        </Typography>
                        <span>
                            <CopyButton
                                data-testid={"export-templates.export-ready-dialog.copy-button"}
                                value={exportUrl}
                                onCopy={() => showSnackbar("Successfully copied!")}
                            />
                        </span>
                    </div>
                </Cell>
            </Grid>
            <Grid className={gridClass}>
                <Cell span={12}>
                    <Typography use={"subtitle1"}>{t`Or download the ZIP archive:`}</Typography>
                </Cell>
                <Cell span={12}>
                    <ButtonSecondary
                        onClick={() => {
                            // Download the ZIP
                            window.open(exportUrl, "_blank", "noopener");
                        }}
                    >
                        <ButtonIcon icon={<FileDownloadIcon />} />
                        Download
                    </ButtonSecondary>
                </Cell>
            </Grid>
        </div>
    );
};

interface UseExportTemplateDialog {
    showExportTemplateContentDialog: (props: ExportTemplateDialogProps) => void;
    showExportTemplateLoadingDialog: (taskId: string) => void;
    showExportTemplateInitializeDialog: (props: ExportTemplatesDialogProps) => void;
    hideDialog: () => void;
}

const useExportTemplateDialog = (): UseExportTemplateDialog => {
    const { showDialog, hideDialog } = useDialog();

    return {
        showExportTemplateContentDialog: props => {
            showDialog(<ExportTemplateDialogMessage {...props} />, {
                title: t`Your export is now ready!`,
                actions: {
                    cancel: { label: t`Close` }
                },
                dataTestId: "export-templates.export-ready-dialog"
            });
        },
        showExportTemplateLoadingDialog: taskId => {
            showDialog(<ExportTemplateLoadingDialogContent taskId={taskId} />, {
                title: t`Preparing your export...`,
                actions: {
                    cancel: { label: t`Cancel` }
                },
                dataTestId: "export-templates.loading-dialog"
            });
        },
        showExportTemplateInitializeDialog: props => {
            showDialog(<ExportTemplateLoadingDialogMessage {...props} />, {
                title: t`Preparing your export...`,
                actions: {
                    cancel: { label: t`Cancel` }
                },
                dataTestId: "export-templates.initial-dialog"
            });
        },
        hideDialog
    };
};

export default useExportTemplateDialog;
