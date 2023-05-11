import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Fragment } from "react";

import { router } from "./router";

const root = createRoot(document.getElementById("root")!);
root.render(
    <Fragment>
        <RouterProvider router={router} />
    </Fragment>
);
