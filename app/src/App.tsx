import './App.css';
import { MyChart } from './Chart';
import { priceData } from './mock';

function App() {
  return (
    <>
      <MyChart priceData={priceData} />
    </>
  );
}

export default App;
