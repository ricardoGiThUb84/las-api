const query = require("../infraestrutura/database/queries");

class TiposVendas {
  listarTipoVenda() {
    const sql = "SELECT * FROM tiposVendas";

    return query(sql);
  }

  buscaTipoVendaId(retornoId) {
    const sql = "SELECT * FROM tiposVendas WHERE id = ?";

    return query(sql, retornoId);
  }

  incluirTipoVenda(retornoForm) {
    const sql = "INSERT INTO tiposVendas SET ?";

    return query(sql, retornoForm);
  }

  alterarTipoVenda(id, retornoForm) {
    const sql = "UPDATE tiposVendas SET ? WHERE id = ?";
    return query(sql, [retornoForm, id]);
  }

  excluirTipoVenda(id) {
    const sql = "DELETE FROM tiposVendas WHERE id = ?";

    return query(sql, id);
  }

  validarNomeVendasNaoUtilizado(retornoForm) {
    const sql = "SELECT * FROM tiposVendas WHERE descricao = ?";

    return query(sql, retornoForm);
  }
}

module.exports = new TiposVendas();
