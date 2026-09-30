// Validação de CPF
export function cleanCPF(value) {
  return (value || '').replace(/\D/g, '');
}

export function formatCPF(value) {
  const digits = cleanCPF(value).substring(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0,3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0,3)}.${digits.slice(3,6)}.${digits.slice(6)}`;
  return `${digits.slice(0,3)}.${digits.slice(3,6)}.${digits.slice(6,9)}-${digits.slice(9,11)}`;
}

export function formatPhone(value) {
  const digits = (value || '').replace(/\D/g, '').substring(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`;
  return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7,11)}`;
}

export function formatDate(value) {
  const digits = (value || '').replace(/\D/g, '').substring(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0,2)}/${digits.slice(2)}`;
  return `${digits.slice(0,2)}/${digits.slice(2,4)}/${digits.slice(4,8)}`;
}

export function validateCPF(cpf) {
  const c = cleanCPF(cpf);
  if (c.length !== 11) return false;
  if (c === c[0].repeat(11)) return false;

  const calcDigit = (slice, factor) => {
    let total = 0;
    for (const ch of slice) {
      total += parseInt(ch) * factor--;
    }
    const rest = total % 11;
    return rest < 2 ? '0' : String(11 - rest);
  };

  const d1 = calcDigit(c.slice(0, 9), 10);
  const d2 = calcDigit(c.slice(0, 10), 11);
  return c[9] === d1 && c[10] === d2;
}

export function parseDateBR(dateStr) {
  if (!dateStr || dateStr.length < 10) return null;
  const [day, month, year] = dateStr.split('/');
  if (!day || !month || !year) return null;
  const d = new Date(Number(year), Number(month) - 1, Number(day));
  if (isNaN(d.getTime())) return null;
  return d;
}

export function calcAge(birthDate) {
  if (!birthDate) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

export function formatCPFDisplay(cpf) {
  if (!cpf || cpf.length !== 11) return cpf;
  return `${cpf.slice(0,3)}.${cpf.slice(3,6)}.${cpf.slice(6,9)}-${cpf.slice(9,11)}`;
}

export function exportToCSV(registros) {
  const headers = ['id','cpf','nome','email','estado_civil','sexo','data_nascimento','endereco','bairro','cidade','telefone','idade','chefe_de_equipe','criado_em'];
  const rows = registros.map(r => [
    r.id,
    r.cpf,
    r.nome,
    r.email,
    r.estado_civil || '',
    r.sexo || '',
    r.data_nascimento || '',
    r.endereco || '',
    r.bairro || '',
    r.cidade_estado || '',
    r.telefone || '',
    r.idade || '',
    r.chefe_de_equipe ? 'Sim' : 'Não',
    r.created_at ? new Date(r.created_at.seconds * 1000).toLocaleString('pt-BR') : '',
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `inscritos_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
