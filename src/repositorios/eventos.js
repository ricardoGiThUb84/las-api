const query = require("../infraestrutura/database/queries");

class Evento {
  listarEvento() {
    const sql = "SELECT * FROM evento";

    return query(sql);
  }

  buscaEventoId(retornoId) {
    const sql = "SELECT * FROM evento WHERE id = ?";

    return query(sql, retornoId);
  }

  incluirEvento(retornoForm) {
    const sql = "INSERT INTO evento SET ?";

    return query(sql, retornoForm);
  }

  alterarEvento(id, retornoForm) {
    const sql = "UPDATE evento SET ? WHERE id = ?";
    return query(sql, [retornoForm, id]);
  }

  excluirEvento(id) {
    const sql = "DELETE FROM evento WHERE id = ?";

    return query(sql, id);
  }

  listarEventosAgendados() {
    const sql = "SELECT * FROM evento WHERE dataInicio > CURDATE()";

    return query(sql).then((agendado) => {
      return agendado.map((item) => ({ ...item }));
    });
  }

  listarEventosEmAndamento() {
    const sql =
      "SELECT * FROM evento WHERE dataInicio <= CURDATE() and dataFim >= CURDATE()";

    return query(sql).then((emAndamento) => {
      return emAndamento.map((item) => ({ ...item }));
    });
  }

  listarEventosFinalizados() {
    const sql = "SELECT * FROM evento WHERE dataFim < CURDATE()";

    return query(sql).then((finalizado) => {
      return finalizado.map((item) => ({ ...item }));
    });
  }

  // inicio query de validação

  validarNomeEventoNaoUtilizado(retornoForm) {
    const sql = "SELECT * FROM evento WHERE nome = ?";

    return query(sql, retornoForm);
  }

  validaNomeEventoNaoUtilizadoPUT(id, retornoForm) {
    const sql = "SELECT * FROM evento where not id = ? and nome = ?";

    return query(sql, [id, retornoForm]);
  }

  // fim query de validação
}

module.exports = new Evento();
