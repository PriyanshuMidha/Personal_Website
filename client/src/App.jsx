import AppRoutes from "./routes/AppRoutes.jsx";
import ToastProvider from "./components/ToastProvider.jsx";

const App = () => (
  <ToastProvider>
    <AppRoutes />
  </ToastProvider>
);

export default App;
