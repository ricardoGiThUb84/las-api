const repositorio = require("../repositorios/usuarios");
const funcoesValidacoes = require("../validacoes/validacoes");
const listaValidacoes = require("../validacoes/listaValidacoes");
const moment = require("moment");

class DadosPessoais {
  constructor() {
    this.valida = funcoesValidacoes.valida;

    this.validacoes = listaValidacoes;
  }

  buscaDadosPessoaisId(idUsuario) {
    return repositorio.buscaDadosPessoaisId(idUsuario);
  }

  async alterarDadosPessoais(id, retornoForm) {
    const dataNascimento = moment(
      retornoForm.dataNascimento,
      "DD-MM-YYYY",
      true
    ).format("YYYY-MM-DD");

    const retornoFormDataNascFormatado = { ...retornoForm, dataNascimento };

    const parametros = {
      nomeCompleto: retornoForm.nomeCompleto.length,
      validaCPF: retornoForm.cpf,
    };

    const erros = await this.valida(parametros);

    const existemErros = erros.length;

    if (existemErros) {
      return Promise.reject(erros);
    }

    return repositorio.alterarDadosPessoais(id, retornoFormDataNascFormatado);
  }
}

module.exports = new DadosPessoais();
