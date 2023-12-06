import { lazy, Suspense } from "react";
import { Collapse, CollapseProps } from "antd";

const DemoSelectConfirm = lazy(() =>
    import("./components/demo-select-confirm.component")
);
const DemoIframePowerBI = lazy(() =>
    import("./components/demo-iframe-powerbi.component")
);
const LearnFetching = lazy(() =>
    import("./components/learn-fetching/learn-fetching.component")
);
const EmployeeList = lazy(() =>
    import("../employee/employee-list/employee-list.component")
);
const LearnReactHooks = lazy(() =>
    import("./components/learn-react-hooks/learn-react-hooks.component")
);
const LearnStyling = lazy(() =>
    import("./components/learn-styling/learn-styling")
);
const Other = lazy(() => import("./components/other/other.component"));

const items: CollapseProps["items"] = [
    {
        key: "1",
        label: "Demo select confirm",
        children: (
            <Suspense fallback={<div>Loading...</div>}>
                <DemoSelectConfirm />
            </Suspense>
        ),
    },
    {
        key: "2",
        label: "Demo iframe PowerBI",
        children: (
            <Suspense fallback={<div>Loading...</div>}>
                <DemoIframePowerBI />
            </Suspense>
        ),
    },
    {
        key: "3",
        label: "Demo search advanced 2 styles",
        children: (
            <Suspense fallback={<div>Loading...</div>}>
                <EmployeeList />
            </Suspense>
        ),
    },
    {
        key: "4",
        label: "Learn Fetching REST",
        children: (
            <Suspense fallback={<div>Loading...</div>}>
                <LearnFetching />
            </Suspense>
        ),
    },
    {
        key: "5",
        label: "React hooks",
        children: (
            <Suspense fallback={<div>Loading...</div>}>
                <LearnReactHooks />
            </Suspense>
        ),
    },
    {
        key: "6",
        label: "Styling",
        children: (
            <Suspense fallback={<div>Loading...</div>}>
                <LearnStyling />
            </Suspense>
        ),
    },
    {
        key: "7",
        label: "Other...",
        children: (
            <Suspense fallback={<div>Loading...</div>}>
                <Other />
            </Suspense>
        ),
    },
];

const PlayGround = () => {
    return <Collapse items={items} />;
};

export default PlayGround;