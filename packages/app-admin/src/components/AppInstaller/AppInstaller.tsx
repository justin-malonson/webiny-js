import React, { useEffect, useState } from "react";
import { default as localStorage } from "store";
import { LoginScreen, Tags } from "~/index";
import { useSecurity } from "@webiny/app-security";
import { CircularProgress } from "@webiny/ui/Progress";
import { ButtonPrimary } from "@webiny/ui/Button";
import { SplitView, LeftPanel, RightPanel } from "../SplitView";
import { Elevation } from "@webiny/ui/Elevation";
import { useInstaller } from "./useInstaller";
import Sidebar from "./Sidebar";

declare global {
    interface Window {
        Cypress: any;
    }
}

import { Wrapper, InnerContent, InstallContent, installerSplitView, SuccessDialog } from "./styled";
import { config as appConfig } from "@webiny/app/config";

export const AppInstaller: React.FC = ({ children }) => {
    const tenantId = localStorage.get("webiny_tenant") || "root";
    const lsKey = `webiny_installation_${tenantId}`;
    const wbyVersion = appConfig.getKey("WEBINY_VERSION", process.env.REACT_APP_WEBINY_VERSION);
    const isRootTenant = tenantId === "root";
    /*
     * This flag allows us to avoid rendering the <iframe> when the app is tested with Cypress
     * (Cypress doesn't work with cross domains because of security-related implications).
     * @see https://docs.cypress.io/guides/guides/web-security#Insecure-Content
     */
    const isCypressTest = window && window.Cypress;

    const markInstallerAsCompleted = () => {
        localStorage.set(lsKey, wbyVersion);
    };

    const isInstallerCompleted = () => {
        return localStorage.get(lsKey) === wbyVersion;
    };

    const [finished, setFinished] = useState(false);
    const { identity } = useSecurity();
    const { loading, installers, installer, isFirstInstall, showNextInstaller, showLogin, onUser } =
        useInstaller({ isInstalled: isInstallerCompleted() });

    useEffect(() => {
        if (identity) {
            onUser();
        }
    }, [identity]);

    if (isInstallerCompleted()) {
        return <LoginScreen>{children}</LoginScreen>;
    }

    const renderLayout = (content: React.ReactNode, secure = false): React.ReactElement => {
        return (
            <Tags tags={{ installer: true }}>
                <SplitView className={installerSplitView}>
                    <LeftPanel span={2}>
                        <Sidebar
                            allInstallers={installers}
                            installer={installer}
                            showLogin={showLogin}
                        />
                    </LeftPanel>
                    <RightPanel span={10}>
                        {!showLogin && !secure && content}
                        {(showLogin || secure) && <LoginScreen>{content}</LoginScreen>}
                    </RightPanel>
                </SplitView>
            </Tags>
        );
    };

    const renderBody = (content: React.ReactNode): React.ReactElement => {
        return (
            <Wrapper>
                <InstallContent>
                    <InnerContent>{content}</InnerContent>
                </InstallContent>
            </Wrapper>
        );
    };

    // Loading installers data
    if (loading) {
        return <CircularProgress label={"Checking apps..."} />;
    }

    // This means there are no installers to run or installation was finished
    if (!loading && (installers.length === 0 || finished)) {
        markInstallerAsCompleted();
        return <LoginScreen>{children}</LoginScreen>;
    }

    if (installer) {
        return renderLayout(
            renderBody(installer.render({ onInstalled: showNextInstaller })),
            installer.secure
        );
    }

    return renderLayout(
        renderBody(
            <Elevation z={1}>
                <SuccessDialog>
                    <p>You have successfully installed all new applications!</p>
                    {!isCypressTest && isRootTenant && isFirstInstall ? (
                        <iframe
                            height="0"
                            width="0"
                            frameBorder="0"
                            style={{ opacity: "0" }}
                            src="https://www.webiny.com/thank-you/new-install"
                        ></iframe>
                    ) : null}
                    <ButtonPrimary
                        data-testid={"open-webiny-cms-admin-button"}
                        onClick={() => {
                            markInstallerAsCompleted();
                            setFinished(true);
                        }}
                    >
                        Finish install
                    </ButtonPrimary>
                </SuccessDialog>
            </Elevation>
        ),
        true
    );
};
