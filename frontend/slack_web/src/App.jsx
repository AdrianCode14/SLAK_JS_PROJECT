import React, { lazy, Suspense } from "react";

import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router-dom";

import store from "./store";
import { Provider } from "react-redux";

import AuthProvider from "./components/AuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    const ErrorPage = lazy(() => import("./pages/ErrorPage"));
    const HomePage = lazy(() => import("./pages/HomePage"));
    const LoginPage = lazy(() => import("./pages/LoginPage"));
    const BrowsePage = lazy(() => import("./pages/BrowsePage"));
    const CreateGardenPage = lazy(() => import("./pages/CreateGardenPage"));
    const EditGardenPage = lazy(() => import("./pages/EditGardenPage"));
    const MyGardensPage = lazy(() => import("./pages/MyGardensPage"));
    const RegisterPage = lazy(() => import("./pages/RegisterPage"));
    const AccountPage = lazy(() => import("./pages/AccountPage"));
    const MyGardenId = lazy(() => import("./pages/MyGardenIdPage"));
    const ZonePage = lazy(() => import("./pages/ZonePage"));
    const AdminPage = lazy(() => import("./pages/admin/AdminPage"));

    const router = createBrowserRouter(
        createRoutesFromElements(
            <>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/browse" element={<BrowsePage />} />
                <Route path="/create-garden" element={<CreateGardenPage />} />
                <Route path="/edit-garden" element={<EditGardenPage />} />
                <Route path="/my-gardens" element={<MyGardensPage />} />
                <Route path="/my-garden/:id" element={<MyGardenId />} />
                <Route path="/area/:id" element={<ZonePage />} />
                <Route path="*" element={<ErrorPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/admin" element={<AdminPage />} />
            </>
        )
    );

    return (
        <Provider store={store}>
            <AuthProvider>
                <Suspense fallback={<>...</>}>
                    <ToastContainer
                        position="bottom-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick={false}
                        rtl={false}
                        pauseOnFocusLoss={false}
                        draggable={false}
                        pauseOnHover={false}
                        theme="light"
                    />

                    <RouterProvider router={router} />
                </Suspense>
            </AuthProvider>
        </Provider>
    );
}

export default App;
