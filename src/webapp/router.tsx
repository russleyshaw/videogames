import { createHashRouter as createRouter } from "react-router-dom";

import { AppView } from "./views/AppView";

export const router = createRouter([
    {
        path: "/",
        element: <AppView />,
    },
]);
