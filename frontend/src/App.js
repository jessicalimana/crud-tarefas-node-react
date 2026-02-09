import './App.css';
import Login from './components/Login';
import Tarefas from './components/Tarefas';

function App() {
  const token = localStorage.getItem('token');

  return (
    <div className="App">
      {token ? <Tarefas /> : <Login />}
    </div>
  );
}

export default App;