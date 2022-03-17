import React from 'react';
import './App.css';
import LoginPage from "./pages/LoginPage";
import EnterSchedulePage from "./pages/EnterSchedulePage"
import {
    Routes,
    Route,
    // Link,
    // useNavigate,
    useLocation,
    Navigate,
    Outlet,
} from "react-router-dom";
import {fakeAuthProvider} from "./auth";
import DoctorDashboard from "./pages/DoctorDashboard";

export default function App() {
  return (
      <AuthProvider>
          <Routes>
              <Route element={<Layout />}>
                  <Route path="/" element={<p>Public Page</p>} />
                  <Route path="/login" element={<header className="App-header"><LoginPage /></header>} />
                  <Route
                      path="/doctor"
                      element={
                          <RequireAuth>
                              <DoctorDashboard />
                          </RequireAuth>
                      }
                  />
                    <Route
                        path="/setSchedule"
                        element={<header className="App-header"><EnterSchedulePage/></header>}
                    />
                  </Route>
          </Routes>
      </AuthProvider>
  );
}

function Layout() {
    return (
        <>
            <Outlet />
        </>
    );
}

interface AuthContextType {
    user: any;
    signin: (user: string, callback: VoidFunction) => void;
    signout: (callback: VoidFunction) => void;
}

const AuthContext = React.createContext<AuthContextType>(null!);

function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<any>(null);

    const signin = (newUser: string, callback: VoidFunction) => {
        return fakeAuthProvider.signin(() => {
            setUser(newUser);
            callback();
        });
    };

    const signout = (callback: VoidFunction) => {
        return fakeAuthProvider.signout(() => {
            setUser(null);
            callback();
        });
    };

    const value = { user, signin, signout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
    return React.useContext(AuthContext);
}

function RequireAuth({ children }: { children: JSX.Element }) {
    let auth = useAuth();
    let location = useLocation();

    if (!auth.user) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}
