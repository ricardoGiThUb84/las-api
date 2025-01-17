const supertest = require("supertest");
const customExpress = require("../src/config/customExpress");

const rotas = supertest(customExpress());

jest.mock("../src/repositorios/eventos");

const retornoEventos = [
  {
    id: 1,
    nome: "Carnaval",
    descricao: "festa popular",
    urlFoto: "https://randomuser.me/api/portraits/men/98.jpg",
    dataInicio: "2023-02-10T03:00:00.000Z",
    dataFim: "2023-02-17T03:00:00.000Z",
    status: "agendado",
  },
  {
    id: 2,
    nome: "Carnaval de Bairro",
    descricao: "festa popular nos bairros",
    urlFoto: "https://randomuser.me/api/portraits/men/98.jpg",
    dataInicio: "2022-05-10T03:00:00.000Z",
    dataFim: "2023-05-30T03:00:00.000Z",
    status: "em-andamento",
  },
  {
    id: 3,
    nome: "Lavagem de Itapuã",
    descricao: "festa popular nos bairros",
    urlFoto: "https://randomuser.me/api/portraits/men/98.jpg",
    dataInicio: "2022-05-10T03:00:00.000Z",
    dataFim: "2022-05-12T03:00:00.000Z",
    status: "finalizado",
  },
];

describe("Testa API EVENTOS GET", () => {
  test("API de Eventos", async () => {
    const response = await rotas.get("/eventos");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(retornoEventos);
  });

  // Buscas por ID

  test("Retorna Eventos por ID existente", async () => {
    const id = 2;
    const retorno = retornoEventos.filter((usuario) => usuario.id === id);

    const response = await rotas.get(`/eventos/${id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(retorno[0]);
  });

  test("Retorna Eventos por ID inexistente", async () => {
    const id = "99999";
    const retorno = "Evento não encontrado";

    const response = await rotas.get(`/eventos/${id}`);
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual(retorno);
  });

  test("Retorna Eventos tipo ID diferente de Number", async () => {
    const id = "kkkk";
    const retorno = "Id inválido fornecido";

    const response = await rotas.get(`/eventos/${id}`);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(retorno);
  });

  // FIM Buscas por ID

  // Buscas por nome

  test("Retorna eventos por status: agendado", async () => {
    const status = "agendado";

    const response = await rotas.get(`/eventos/status/${status}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      {
        id: 1,
        nome: "Carnaval",
        descricao: "festa popular",
        urlFoto: "https://randomuser.me/api/portraits/men/98.jpg",
        dataInicio: "2023-02-10T03:00:00.000Z",
        dataFim: "2023-02-17T03:00:00.000Z",
      },
    ]);
  });

  test("Retorna eventos por status: em-andamento", async () => {
    const status = "em-andamento";

    const response = await rotas.get(`/eventos/status/${status}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      {
        id: 2,
        nome: "Carnaval de Bairro",
        descricao: "festa popular nos bairros",
        urlFoto: "https://randomuser.me/api/portraits/men/98.jpg",
        dataInicio: "2022-05-10T03:00:00.000Z",
        dataFim: "2023-05-30T03:00:00.000Z",
      },
    ]);
  });

  test("Retorna eventos por status: finalizado", async () => {
    const status = "finalizado";

    const response = await rotas.get(`/eventos/status/${status}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      {
        id: 3,
        nome: "Lavagem de Itapuã",
        descricao: "festa popular nos bairros",
        urlFoto: "https://randomuser.me/api/portraits/men/98.jpg",
        dataInicio: "2022-05-10T03:00:00.000Z",
        dataFim: "2022-05-12T03:00:00.000Z",
      },
    ]);
  });

  test("Retorna status inválido", async () => {
    const status = "kkkk";

    const response = await rotas.get(`/eventos/status/${status}`);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual("Status inválido fornecido");
  });
});

describe("Testa API EVENTOS POST", () => {
  test("Adicionar eventos com dados válidos", async () => {
    const response = await rotas.post("/eventos").send({
      nome: "Ensaio Ilê",
      descricao: "festa popular nos bairros",
      urlFoto: "https://randomuser.me/api/portraits/men/44.jpg",
      dataInicio: "02-05-2023",
      dataFim: "12-05-2023",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      id: 4,
      descrição: "Evento incluído com sucesso",
    });
  });

  test("Adicionar eventos com data inválida", async () => {
    const response = await rotas.post("/eventos").send({
      nome: "Ensaio Ilê",
      descricao: "festa popular nos bairros",
      urlFoto: "https://randomuser.me/api/portraits/men/44.jpg",
      dataInicio: "01-05-2022",
      dataFim: "12-05-2023",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual([
      {
        nome: "data",
        mensagem: "Data inválida!",
        resultado: true,
      },
    ]);
  });

  test("Adicionar eventos com nome já existente", async () => {
    const response = await rotas.post("/eventos").send({
      nome: "Carnaval de Bairro",
      descricao: "festa popular nos bairros",
      urlFoto: "https://randomuser.me/api/portraits/men/44.jpg",
      dataInicio: "01-05-2023",
      dataFim: "12-05-2023",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual([
      {
        nome: "existeEvento",
        mensagem: "Evento já existe na base de dados",
        resultado: true,
      },
    ]);
  });
});

describe("Testa API EVENTOS PUT", () => {
  test("Atualiza eventos com dados válidos", async () => {
    const response = await rotas.put("/eventos/1").send({
      nome: "Ensaio Ilê",
      descricao: "festa popular nos bairros",
      urlFoto: "https://randomuser.me/api/portraits/men/44.jpg",
      dataInicio: "05-05-2023",
      dataFim: "12-05-2023",
    });

    expect(response.statusCode).toBe(204);
    expect(response.body).toEqual({});
  });

  test("Atualiza eventos com dados inválidos", async () => {
    const response = await rotas.put("/eventos/1").send({
      nome: "Ens",
      descricao: "festa popular nos bairros",
      urlFoto: "https://randomuser.me/api/portraits/men/44.jpg",
      dataInicio: "10-05-2022",
      dataFim: "12-05-2023",
    });

    expect(response.statusCode).toBe(405);
    expect(response.body).toEqual([
      {
        mensagem: "Evento deve ter pelo menos cinco caracteres",
        nome: "nomeEvento",
        resultado: true,
      },
      { mensagem: "Data inválida!", nome: "data", resultado: true },
    ]);
  });

  test("Atualiza eventos com nome inválido", async () => {
    const response = await rotas.put("/eventos/2").send({
      nome: "Carnaval",
      descricao: "festa popular nos bairros",
      urlFoto: "https://randomuser.me/api/portraits/men/44.jpg",
      dataInicio: "10-05-2023",
      dataFim: "12-05-2023",
    });

    expect(response.statusCode).toBe(405);
    expect(response.body).toEqual([
      {
        mensagem: "Evento já existe na base de dados",
        nome: "existeEventoPUT",
        resultado: true,
      },
    ]);
  });

  test("Atualiza eventos com id inexistente", async () => {
    const response = await rotas.put("/eventos/9999").send({
      nome: "Ensaio Ilê",
      descricao: "festa popular nos bairros",
      urlFoto: "https://randomuser.me/api/portraits/men/44.jpg",
      dataInicio: "10-05-2023",
      dataFim: "12-05-2023",
    });

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual("Evento não encontrado.");
  });

  test("Atualiza eventos com id inválido", async () => {
    const response = await rotas.put("/eventos/ZZZZZZ").send({
      nome: "Ensaio Ilê",
      descricao: "festa popular nos bairros",
      urlFoto: "https://randomuser.me/api/portraits/men/44.jpg",
      dataInicio: "10-05-2023",
      dataFim: "12-05-2023",
    });

    expect(response.statusCode).toBe(405);
    expect(response.body).toEqual("ID inválido");
  });
});

describe("Testa API EVENTOS DELETE", () => {
  test("Apaga usuário na base de dados", async () => {
    const response = await rotas.delete("/eventos/2");

    expect(response.statusCode).toBe(204);
  });

  test("Apaga evento inexistente na base de dados", async () => {
    const response = await rotas.delete("/eventos/666");

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual("Evento não encontrado");
  });

  test("Apaga evento inexistente na base de dados", async () => {
    const response = await rotas.delete("/eventos/kkkk");

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual("Id inválido fornecido");
  });
});
