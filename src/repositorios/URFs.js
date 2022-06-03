const query = require("../infraestrutura/database/queries");

class URF {
  incluirMunicipios(csv) {
    const sql =
      "INSERT INTO municipios (id, nome, `UF-sigla`, `UF-nome`) VALUES ?";

    return query(sql, [csv]);
  }

  incluirURFs(csv) {
    const sql = "INSERT INTO ufs (id, sigla, nome) VALUES ?";

    return query(sql, [csv]);
  }

  buscaUfs() {
    const sql = "SELECT * FROM ufs ORDER BY nome";

    return query(sql).then((siglas) => siglas.map((item) => item.sigla));
  }

  buscaMunicipioPorUF(UF) {
    const sql = "SELECT * FROM municipios WHERE `UF-sigla` = ? ORDER BY nome";
    return query(sql, UF).then((municipios) =>
      municipios.map((item) => item.nome)
    );
  }
}

module.exports = new URF();
