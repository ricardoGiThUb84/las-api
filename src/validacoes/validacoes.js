const repositorioUsuario = require("../repositorios/usuarios");
const repositorioTipoVenda = require("../repositorios/tiposVendas");
const repositorioEventos = require("../repositorios/eventos");
const fetch = require("node-fetch");
const moment = require("moment");

class Validacao {
  async validarURLFotoPerfil(retornoForm) {
    const validadorUrl =
      /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/gi;
    const urlEhValida = validadorUrl.test(retornoForm);

    if (urlEhValida) {
      const response = await fetch(retornoForm);

      if (response.status === 200) return true;
      else return false;
    }

    return false;
  }

  verificaTamanhoNome(tamanho) {
    return tamanho > 4;
  }

  //Validacoes Usuarios

  async validarNomeUsuarioNaoUtilizadoPUT({ id, retornoForm }) {
    const existeUsuarioPUT =
      await repositorioUsuario.validarNomeUsuarioNaoUtilizadoPUT(
        id,
        retornoForm
      );

    if (existeUsuarioPUT[0]?.nome === retornoForm.trim()) return !true;

    return !false;
  }

  async validaSeNomeFoiUtilizado(retornoForm) {
    const existeUsuario =
      await repositorioUsuario.validarNomeUsuarioNaoUtilizado(retornoForm);

    if (existeUsuario[0]?.nome === retornoForm.trim()) return !true;

    return !false;
  }

  // fim validacao usuarios

  //Validacoes Tipo vendas

  async validaSeDescricaoFoiUtilizado(retornoForm) {
    const existeUsuario =
      await repositorioTipoVenda.validarNomeVendasNaoUtilizado(retornoForm);

    if (existeUsuario[0]?.descricao === retornoForm.trim()) return !true;

    return !false;
  }

  // fim validacao Tipo vendas

  //Validacoes Eventos

  async validaSeNomeEventoFoiUtilizado(retornoForm) {
    const existeEvento = await repositorioEventos.validarNomeEventoNaoUtilizado(
      retornoForm
    );
    if (existeEvento[0]?.nome === retornoForm.trim()) return !true;

    return !false;
  }

  async validarNomeEventoNaoUtilizadoPUT({ id, retornoForm }) {
    const existeEvento =
      await repositorioEventos.validarNomeEventoNaoUtilizadoPUT(
        id,
        retornoForm
      );

    if (existeEvento[0]?.nome === retornoForm.trim()) return !true;

    return !false;
  }

  isDatasValidas({ dataInicio, dataFim }) {
    const currentDate = moment().format("YYYY-MM-DD");

    const validEvent =
      moment(currentDate).isSameOrBefore(dataInicio) &&
      moment(dataInicio).isSameOrBefore(dataFim);

    if (validEvent) return true;
    else return false;
  }

  exibeStatus({ dataInicio, dataFim }) {
    const currentDate = moment().format("YYYY-MM-DD");

    const validEvent = moment(currentDate).isSameOrBefore(dataInicio);

    const agendado = moment(dataInicio).isBefore(dataFim);
    const andamento = moment(currentDate).isSameOrAfter(dataInicio);
    // const finalizado = moment(dataFim).isSameOrBefore(currentDate);

    console.log("data", andamento, "dataInicio", dataInicio);

    if (validEvent) {
      if (andamento) return "em-andamento";
      else if (agendado) return "agendado";
      else return "finalizado";
      // else if (finalizado) return "finalizado";
    }
    // return false;
    return "finalizado";
  }

  // fim validacao Eventos

  async valida(parametros) {
    const validacoesComResultado = await Promise.all(
      this.validacoes.map(async (campo) => {
        const { nome } = campo;
        const parametro = parametros[nome];

        if (!parametro) return { ...campo, resultado: !true };

        const resposta = await campo.valido(parametro);

        console.log(nome, resposta);

        return { ...campo, resultado: !resposta };
      })
    );

    return validacoesComResultado.filter((campo) => campo.resultado);
  }
}

module.exports = new Validacao();