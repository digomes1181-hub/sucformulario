import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { getInscricoes, deleteInscricao } from '../services/firestore';
import { exportToCSV, formatCPFDisplay } from '../utils';
import { Search, Download, Trash2, ArrowLeft, LayoutDashboard } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminInscritos() {
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!isAdmin) { navigate('/admin'); return; }
    loadData();
  }, [isAdmin]);

  async function loadData() {
    setLoading(true);
    const data = await getInscricoes();
    setRegistros(data);
    setLoading(false);
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return registros;
    return registros.filter(r =>
      r.nome?.toLowerCase().includes(q) ||
      r.cpf?.includes(q) ||
      r.email?.toLowerCase().includes(q)
    );
  }, [registros, search]);

  async function handleDelete(id, nome) {
    if (!confirm(`Tem certeza que deseja excluir a inscrição de "${nome}"?`)) return;
    setDeleting(id);
    try {
      await deleteInscricao(id);
      setRegistros(prev => prev.filter(r => r.id !== id));
      toast.success('Inscrição excluída com sucesso.');
    } catch {
      toast.error('Erro ao excluir inscrição.');
    }
    setDeleting(null);
  }

  const formatDate = (ts) => {
    if (!ts) return '-';
    const d = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
    return d.toLocaleString('pt-BR');
  };

  if (!isAdmin) return null;

  return (
    <div className="admin-page">
      <div className="admin-container wide">
        {/* Header */}
        <div className="list-header">
          <div>
            <h2>Lista de Inscritos</h2>
            <p className="list-subtitle">
              {loading ? 'Carregando...' : `${filtered.length} de ${registros.length} inscrição(ões)`}
            </p>
          </div>
          <div className="list-actions">
            <div className="search-wrapper">
              <Search size={16} className="search-icon" />
              <input
                className="search-input"
                placeholder="Buscar por nome, CPF ou e-mail..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              className="btn-action btn-info"
              onClick={() => exportToCSV(registros)}
              disabled={registros.length === 0}
            >
              <Download size={16} /> Exportar CSV
            </button>
            <Link to="/admin/painel" className="btn-action btn-secondary">
              <LayoutDashboard size={16} /> Painel
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="page-center"><div className="spinner" /></div>
        ) : registros.length === 0 ? (
          <div className="empty-state">
            <p>Nenhuma inscrição encontrada.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>CPF</th>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Data Nasc.</th>
                  <th>Idade</th>
                  <th>Chefe</th>
                  <th>Criado em</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, idx) => (
                  <tr key={r.id}>
                    <td>{idx + 1}</td>
                    <td className="mono">{formatCPFDisplay(r.cpf)}</td>
                    <td>{r.nome}</td>
                    <td>{r.email}</td>
                    <td>{r.data_nascimento || '-'}</td>
                    <td>{r.idade ?? '-'}</td>
                    <td>
                      <span className={`badge ${r.chefe_de_equipe ? 'badge-open' : 'badge-neutral'}`}>
                        {r.chefe_de_equipe ? 'Sim' : 'Não'}
                      </span>
                    </td>
                    <td>{formatDate(r.created_at)}</td>
                    <td>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(r.id, r.nome)}
                        disabled={deleting === r.id}
                        title="Excluir inscrição"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
