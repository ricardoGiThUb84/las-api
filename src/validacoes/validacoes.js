const repositorioUsuario = require("../repositorios/usuarios");
const repositorioTipoVenda = require("../repositorios/tiposVendas");
const repositorioEventos = require("../repositorios/eventos");
const fetch = require("node-fetch");
const moment = require("moment");
const validadorCPF = require("cpf-cnpj-validator");

const EVENTO_AGENDADO = "agendado";
const EVENTO_ANDAMENTO = "em-andamento";
const EVENTO_FINALIZADO = "finalizado";

class Validacao {
  async validarURLFotoPerfil(retornoForm) {
    const validadorUrl =
      /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/gi;
    const urlEhValida = validadorUrl.test(retornoForm);

    if (urlEhValida) {
      const response = await fetch(retornoForm);

      return response.status === 200;
    }

    return false;
  }

  verificaTamanhoNome(tamanho) {
    if (tamanho === undefined) return true;
    return tamanho > 4;
  }

  //Validacoes Usuarios

  async validarNomeUsuarioNaoUtilizadoPUT({ id, retornoForm }) {
    const existeUsuarioPUT =
      await repositorioUsuario.validarNomeUsuarioNaoUtilizadoPUT(
        id,
        retornoForm
      );

    if (existeUsuarioPUT[0]?.nome === retornoForm.trim()) return false;

    return true;
  }

  async validaSeNomeFoiUtilizado(retornoForm) {
    const existeUsuario =
      await repositorioUsuario.validarNomeUsuarioNaoUtilizado(retornoForm);

    if (existeUsuario[0]?.nome === retornoForm?.trim()) return false;

    return true;
  }

  // fim validacao usuarios

  //Validacoes Tipo vendas

  async validaSeDescricaoFoiUtilizado(retornoForm) {
    const existeUsuario =
      await repositorioTipoVenda.validarNomeVendasNaoUtilizado(retornoForm);

    if (existeUsuario[0]?.descricao === retornoForm.trim()) return false;

    return true;
  }

  // fim validacao Tipo vendas

  //Validacoes Eventos

  async validaSeNomeEventoFoiUtilizado(retornoForm) {
    const existeEvento = await repositorioEventos.validarNomeEventoNaoUtilizado(
      retornoForm
    );

    console.log("VALIDASENOMEAQUI", existeEvento, retornoForm);
    if (existeEvento[0]?.nome === retornoForm?.trim()) return false;

    return true;
  }

  async validarNomeEventoNaoUtilizadoPUT({ id, retornoForm }) {
    const existeEvento =
      await repositorioEventos.validaNomeEventoNaoUtilizadoPUT(id, retornoForm);

    if (existeEvento[0]?.nome === retornoForm.trim()) return false;

    return true;
  }

  isDatasValidas({ dataInicio, dataFim }) {
    const currentDate = moment().format("YYYY-MM-DD");

    const validEvent =
      moment(currentDate).isSameOrBefore(dataInicio) &&
      moment(dataInicio).isSameOrBefore(dataFim);

    return validEvent;
  }

  insereStatus(evento) {
    const status = this.exibeStatus(evento);

    return { ...evento, status };
  }

  exibeStatus(evento) {
    const dataInicio = moment(evento.dataInicio);
    const dataFim = moment(evento.dataFim);

    const currentDate = moment();

    if (dataInicio.isAfter(currentDate)) {
      return EVENTO_AGENDADO;
    } else if (
      dataInicio.isSameOrBefore(currentDate) &&
      dataFim.isSameOrAfter(currentDate)
    ) {
      return EVENTO_ANDAMENTO;
    } else if (dataFim.isBefore(currentDate)) {
      return EVENTO_FINALIZADO;
    }

    return undefined;
  }

  // fim validacao Eventos

  // Validacoes Dados Pessoais

  validaCPF(cpf) {
    return validadorCPF.cpf.isValid(cpf);
  }

  // fim Validacoes Dados Pessoais

  async valida(parametros) {
    const validacoesComResultado = await Promise.all(
      this.validacoes.map(async (campo) => {
        const { nome } = campo;
        const parametro = parametros[nome];

        if (!(nome in parametros)) return { ...campo, resultado: false };

        const resposta = await campo.valido(parametro);

        return { ...campo, resultado: !resposta };
      })
    );

    return validacoesComResultado.filter((campo) => campo.resultado);
  }
}

module.exports = new Validacao();
