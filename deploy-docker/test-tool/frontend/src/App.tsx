import { GitHubBanner, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  ThemedLayoutV2,
  ThemedSiderV2,
  useNotificationProvider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerBindings, {
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import { App as AntdApp } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { SiAwslambda } from "react-icons/si";
import {
  BlogPostCreate,
  BlogPostEdit,
  BlogPostList,
  BlogPostShow,
} from "./pages/blog-posts";
import {
  CategoryCreate,
  CategoryEdit,
  CategoryList,
  CategoryShow,
} from "./pages/categories";
import Sim1Page from "./pages/sim1/page";
import { AmazonOutlined, SettingOutlined } from "@ant-design/icons";
import Sim2Page from "./pages/sim2/page";
import Sim3Page from "./pages/sim3/page";
import Sim4Page from "./pages/sim4/page";
import SettingsPage from "./pages/settings/page";

function App() {
  return (
    <BrowserRouter>
      {/* <GitHubBanner /> */}
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider("https://api.fake-rest.refine.dev")}
                notificationProvider={useNotificationProvider}
                routerProvider={routerBindings}
                resources={[
                  // {
                  //   name: "blog_posts",
                  //   list: "/blog-posts",
                  //   create: "/blog-posts/create",
                  //   edit: "/blog-posts/edit/:id",
                  //   show: "/blog-posts/show/:id",
                  //   meta: {
                  //     canDelete: true,
                  //   },
                  // },
                  // {
                  //   name: "categories",
                  //   list: "/categories",
                  //   create: "/categories/create",
                  //   edit: "/categories/edit/:id",
                  //   show: "/categories/show/:id",
                  //   meta: {
                  //     canDelete: true,
                  //   },
                  // },
                  {
                    name: "Test Simulator 1",
                    list: "/sim1",
                    meta: {
                      icon: <SiAwslambda />
                    }
                  },
                  {
                    name: "Test Simulator 2",
                    list: "/sim2",
                    meta: {
                      icon: <SiAwslambda />
                    }
                  },
                  {
                    name: "Test Simulator 3",
                    list: "/sim3",
                    meta: {
                      icon: <SiAwslambda />
                    }
                  },
                  {
                    name: "Test Simulator 4",
                    list: "/sim4",
                    meta: {
                      icon: <SiAwslambda />
                    }
                  },
                  {
                    name: "Settings",
                    list: "/settings",
                    meta: {
                      icon: <SettingOutlined />
                    }
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "QHDuVa-7rl1Fp-Vsim4a",
                  textTransformers: {
                    humanize: (text) => text,
                    plural: (text) => text,
                    singular: (text) => text
                  }
                }}
              >
                <Routes>
                  <Route
                    element={
                      <ThemedLayoutV2
                        Header={() => <Header sticky />}
                        Sider={(props) => <ThemedSiderV2 {...props} fixed />}
                      >
                        <Outlet />
                      </ThemedLayoutV2>
                    }
                  >
                    <Route
                      index
                      element={<NavigateToResource resource="blog_posts" />}
                    />
                    <Route path="/blog-posts">
                      <Route index element={<BlogPostList />} />
                      <Route path="create" element={<BlogPostCreate />} />
                      <Route path="edit/:id" element={<BlogPostEdit />} />
                      <Route path="show/:id" element={<BlogPostShow />} />
                    </Route>
                    <Route path="/categories">
                      <Route index element={<CategoryList />} />
                      <Route path="create" element={<CategoryCreate />} />
                      <Route path="edit/:id" element={<CategoryEdit />} />
                      <Route path="show/:id" element={<CategoryShow />} />
                    </Route>
                    <Route path="/sim1">
                      <Route index element={<Sim1Page />} />
                    </Route>
                    <Route path="/sim2">
                      <Route index element={<Sim2Page />} />
                    </Route>
                    <Route path="/sim3">
                      <Route index element={<Sim3Page />} />
                    </Route>
                    <Route path="/sim4">
                      <Route index element={<Sim4Page />} />
                    </Route>
                    <Route path="/settings">
                      <Route index element={<SettingsPage />} />
                    </Route>
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
