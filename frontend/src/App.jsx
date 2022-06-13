import "./App.css";
import NumberPresenter from "./components/NumberPresenter";
import NumberModifier from "./components/NumberModifier";
import { useCounter } from "./CounterProvider";

function App() {
  const { value, dec, inc } = useCounter();

  return (
    <div className="App">
      <p>Change the value</p>
      <p>{value}</p>
      <button onClick={dec}>-</button>
      <button onClick={inc}>+</button>

      <NumberPresenter value={value} />
      <NumberModifier />
    </div>
  );
}

export default App;
