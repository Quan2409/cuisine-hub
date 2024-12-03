import { useSelector } from "react-redux";
import MainRouter from "./routes/MainRouter";

const App = () => {
  const { theme } = useSelector((state) => state.theme);
  return (
    <div data-theme={theme} className="w-full min-h-[100vh]">
      <MainRouter />
    </div>
  );
};

export default App;
