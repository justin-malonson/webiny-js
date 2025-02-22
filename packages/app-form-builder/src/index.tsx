import React, { Suspense, lazy } from "react";
import { Plugin, Layout, AddMenu, AddRoute } from "@webiny/app-admin";
import { HasPermission } from "@webiny/app-security";
import { ReactComponent as FormsIcon } from "~/admin/icons/round-ballot-24px.svg";
import { CircularProgress } from "@webiny/ui/Progress";
import FormsSettings from "./admin/views/Settings/FormsSettings";

const FormEditor = lazy(() => import("./admin/views/Editor"));
const Forms = lazy(() => import("./admin/views/Forms/Forms"));

interface LoaderProps {
    label: string;
}
const Loader: React.FC<LoaderProps> = ({ children, label, ...props }) => (
    <Suspense fallback={<CircularProgress label={label} />}>
        {React.cloneElement(children as unknown as React.ReactElement, props)}
    </Suspense>
);

export const FormBuilder: React.FC = () => {
    return (
        <Plugin>
            <HasPermission name={"fb.form"}>
                <AddMenu name="formBuilder" label={"Form Builder"} icon={<FormsIcon />}>
                    <AddMenu name="formBuilder.forms" label={"Forms"}>
                        <AddMenu
                            name="formBuilder.forms.forms"
                            label={"Forms"}
                            path="/form-builder/forms"
                        />
                    </AddMenu>
                </AddMenu>
                <AddRoute exact path={"/form-builder/forms/:id"}>
                    <Loader label={"Loading editor..."}>
                        <FormEditor />
                    </Loader>
                </AddRoute>
                <AddRoute exact path={"/form-builder/forms"}>
                    <Layout title={"Form Builder - Forms"}>
                        <Loader label={"Loading view..."}>
                            <Forms />
                        </Loader>
                    </Layout>
                </AddRoute>
            </HasPermission>
            <HasPermission name={"fb.settings"}>
                <AddRoute path="/settings/form-builder/recaptcha">
                    <Layout title={"Form Builder - reCAPTCHA Settings"}>
                        <FormsSettings />
                    </Layout>
                </AddRoute>
                <AddMenu name={"settings"}>
                    <AddMenu name={"settings.formBuilder"} label={"Form Builder"}>
                        <AddMenu
                            name={"settings.formBuilder.recaptcha"}
                            label={"reCAPTCHA"}
                            path={"/settings/form-builder/recaptcha"}
                        />
                    </AddMenu>
                </AddMenu>
            </HasPermission>
        </Plugin>
    );
};

export * from "./plugins";
