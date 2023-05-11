import { createRoot } from "react-dom/client";

import RootView from "./views/RootView";

const root = createRoot(document.getElementById("root")!);
root.render(<RootView />);
