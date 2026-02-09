import React, { useState, useEffect } from 'react';

function Tarefas() {
  const [tarefas, setTarefas] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Busca as tarefas ao carregar o componente
  useEffect(() => {
    const fetchTarefas = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Você precisa estar logado');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/tarefas', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,  // Envia o token aqui!
          },
        });

        const data = await response.json();

        if (response.ok) {
          setTarefas(data);
        } else {
          setError(data.message || 'Erro ao carregar tarefas');
          if (response.status === 401) {
            localStorage.removeItem('token'); // Token inválido → logout
            alert('Sessão expirada. Faça login novamente.');
          }
        }
      } catch (err) {
        setError('Erro ao conectar com o servidor');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTarefas();
  }, []);

  // Adicionar nova tarefa
  const adicionarTarefa = async () => {
    if (!novaTarefa.trim()) return;

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:3000/tarefas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ titulo: novaTarefa }),
      });

      const nova = await response.json();

      if (response.ok) {
        setTarefas([...tarefas, nova]);
        setNovaTarefa('');
      } else {
        alert(nova.message || 'Erro ao adicionar tarefa');
      }
    } catch (err) {
      alert('Erro ao conectar');
    }
  };

  // Toggle completa
  const toggleCompleta = async (id, atualCompleta) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:3000/tarefas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ completa: !atualCompleta }),
      });

      const atualizada = await response.json();

      if (response.ok) {
        setTarefas(tarefas.map(t => t._id === id ? atualizada : t));
      } else {
        alert('Erro ao atualizar');
      }
    } catch (err) {
      alert('Erro ao conectar');
    }
  };

  // Deletar tarefa
  const deletarTarefa = async (id) => {
    if (!window.confirm('Tem certeza que quer deletar?')) return;

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:3000/tarefas/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token,
        },
      });

      if (response.ok) {
        setTarefas(tarefas.filter(t => t._id !== id));
      } else {
        const data = await response.json();
        alert(data.message || 'Erro ao deletar');
      }
    } catch (err) {
      alert('Erro ao conectar');
    }
  };

  // Botão de logout
  const logout = () => {
    localStorage.removeItem('token');
    window.location.reload(); // Recarrega para mostrar login novamente
  };

  if (loading) return <p>Carregando tarefas...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Minhas Tarefas</h2>
        <button
          onClick={logout}
          style={{ padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '6px' }}
        >
          Sair
        </button>
      </div>

      <div style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={novaTarefa}
          onChange={(e) => setNovaTarefa(e.target.value)}
          placeholder="Nova tarefa..."
          style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
          onKeyDown={(e) => e.key === 'Enter' && adicionarTarefa()}
        />
        <button
          onClick={adicionarTarefa}
          style={{ padding: '12px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px' }}
        >
          Adicionar
        </button>
      </div>

      {tarefas.length === 0 ? (
        <p>Nenhuma tarefa ainda. Adicione uma!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tarefas.map(tarefa => (
            <li
              key={tarefa._id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                borderBottom: '1px solid #eee',
                textDecoration: tarefa.completa ? 'line-through' : 'none',
                color: tarefa.completa ? '#888' : '#000',
              }}
            >
              <div style={{ flex: 1 }}>
                <input
                  type="checkbox"
                  checked={tarefa.completa}
                  onChange={() => toggleCompleta(tarefa._id, tarefa.completa)}
                  style={{ marginRight: '12px' }}
                />
                {tarefa.titulo}
              </div>
              <button
                onClick={() => deletarTarefa(tarefa._id)}
                style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px' }}
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Tarefas;