const axios = require("axios");
const express = require("express");
const bodyParser = require("body-parser");
const { WebhookClient } = require("dialogflow-fulfillment");
const { Card, Suggestion } = require("dialogflow-fulfillment");

const app = express();

const urlMikrowisp = `https://demo.mikrosystem.net`;
const token = `Smx2SVdkbUZIdjlCUlkxdFo1cUNMQT09`;

app.use(bodyParser.json());
const port = process.env.PORT || 3000;

app.post("/dialogflow-fulfillment", (request, response) => {
  dialogflowFulfillment(request, response);
});

app.listen(port, () => {
  console.log(`El servidor esta corriendo en el puerto ${port}`);
});

const dialogflowFulfillment = (request, response) => {
  const agent = new WebhookClient({ request, response });

  function demo(agent) {
    agent.add(`desde heroku`);
  }
  function welcome(agent) {
    let numero = agent.parameters.numero;
    return axios({
      method: "get",
      url: `${urlMikrowisp}/api/v1/GetClientsDetails`,
      data: {
        token: `${token}`,
        telefono: numero,
      },
    })
      .then((response) => {
        let estado = response.data.estado;
        if (estado != "exito") {
          agent.add(
            `El número que nos proporcionaste no pertenece a ningún cliente registrado con nosotros, si desea Levantar el reporte en este momento escriba CAMBIAR 
`
          );
        } else {
          let cliente = response.data.datos[0].nombre;
          console.log(cliente);

          agent.add(
            `El numero esta registrado a nombre de ${cliente} es correcto?
SI
NO`
          );
          agent.add(new Suggestion());
        }
      })
      .catch(function (error) {
        agent.add(
          "UPS, hay un error en el servidor, por favor intentelo de nuevo mas tarde"
        );
        console.log(error);
      });
  }
  function changePasword(agent) {
    let numero = agent.parameters.numero;
    return axios({
      method: "get",
      url: `${urlMikrowisp}/api/v1/GetClientsDetails`,
      data: {
        token: `${token}`,
        telefono: numero,
      },
    })
      .then((response) => {
        let estado = response.data.estado;
        if (estado != "exito") {
          agent.add(
            `El número que nos proporcionaste no pertenece a ningún cliente registrado con nosotros, si desea Levantar el reporte en este momento escriba CAMBIAR 
`
          );
        } else {
          let cliente = response.data.datos[0].nombre;
          agent.add(
            `El numero esta registrado a nombre de ${cliente} es correcto?
SI
NO`
          );
        }
      })
      .catch(function (error) {
        agent.add(
          "UPS, hay un error en el servidor, por favor intentelo de nuevo mas tarde"
        );
        console.log(error);
      });
  }

  function newPassword(agent) {
    let numero = agent.parameters.numero;
    return axios({
      method: "get",
      url: `${urlMikrowisp}/api/v1/GetClientsDetails`,
      data: {
        token: `${token}`,
        telefono: numero,
      },
    })
      .then((res) => {
        let cliente = res.data.datos[0].nombre;
        let idClient = res.data.datos[0].id;
        console.log("este es el id " + idClient);
        let newNameNetwork = agent.parameters.ssid;
        let newPasswordp = agent.parameters.newpassword;
        let numero = agent.parameters.numero;
        return axios({
          method: "post",
          url: `${urlMikrowisp}/api/v1/NewTicket`,
          data: {
            token: `${token}`,
            idcliente: idClient,
            dp: 1,
            asunto: `Cliente ${cliente} solicita cambio de contraseña`,
            solicitante: `${cliente} con el numero ${numero}`,
            fechavisita: "2021-08-05",
            turno: "TARDE",
            agendado: "RED SOCIAL",
            contenido:
              "Hola, cliente " +
              cliente +
              " con el numero: " +
              numero +
              " solicita cambio de contraseña por medio del chatbot Nueva contraseña: " +
              newPasswordp +
              "Nuevo Nombre de SSID: " +
              newNameNetwork,
          },
        })
          .then((res) => {
            agent.add(
              `Muchas gracias la informacion fue recibida y será aplicada en un lapzo no mayor a 4 horas`
            );
          })
          .catch(function (error) {
            agent.add(
              "ha ocurrido un error en el ticket, por favor intentelo de nuevo más tarde"
            );
          });
      })
      .catch(function (error) {
        agent.add(
          "ha ocurrido un error, por favor intentelo de nuevo más tarde"
        );
      });
  }
  function ticketPassword(agent) {
    let contra = agent.parameters.contra;
    let titular = agent.parameters.titular;
    let tnumero = agent.parameters.tnumero;
    let red = agent.parameters.red;
    return axios({
      method: "post",
      url: `${urlMikrowisp}/api/v1/NewTicket`,
      data: {
        token: `${token}`,
        idcliente: 3178,
        dp: 1,
        asunto: "Nuevo Ticket de Cambio de contraseña",
        solicitante: "ChatBot",
        fechavisita: "2021-08-05",
        turno: "TARDE",
        agendado: "RED SOCIAL",
        contenido:
          "Hola, cliente " +
          titular +
          " con el numero " +
          tnumero +
          " solicita cambio de contraseña por medio del chatbot Nueva contraseña: " +
          contra +
          "Nuevo Nombre de SSID: " +
          red,
      },
    })
      .then((res) => {
        agent.add(
          `Muchas gracias la informacion fue recibida y será aplicada en un lapzo no mayor a 4 horas`
        );
      })
      .catch(function (error) {
        agent.add(
          "ha ocurrido un error en el ticket, por favor intentelo de nuevo más tarde"
        );
      });
  }

  function noInternet(agent) {
    let numero = agent.parameters.numero;
    return axios({
      method: "get",
      url: `${urlMikrowisp}/api/v1/GetClientsDetails`,
      data: {
        token: `${token}`,
        telefono: numero,
      },
    })
      .then((response) => {
        let estado = response.data.estado;
        let mantenimiento = response.data.datos[0].mantenimiento;
        let cliente = response.data.datos[0].nombre;

        if (estado != "exito") {
          agent.add(`Este numero ${numero} no se encuentra registrado, 

si desea Levantar el reporte en este momento escriba REPORTAR
`);
        } else {
          let facturas = response.data.datos[0].facturacion.facturas_nopagadas;
          let estado = response.data.datos[0].estado;
          let total = response.data.datos[0].facturacion.total_facturas;
          let idcliente = response.data.datos[0].id;

          agent.add(
            `El numero esta registrado a nombre de ${cliente} es correcto?
SI
NO`
          );
        }
      })
      .catch(function (error) {
        agent.add(
          "UPS, hay un error en el servidor, por favor intentelo de nuevo mas tarde"
        );
        console.log(error);
      });
  }

  function ticketNointernetyes(agent) {
    let numero = agent.parameters.numero;
    return axios({
      method: "get",
      url: `${urlMikrowisp}/api/v1/GetClientsDetails`,
      data: {
        token: `${token}`,
        telefono: numero,
      },
    })
      .then((res) => {
        let mantenimiento = res.data.datos[0].mantenimiento;
        let nombre = res.data.datos[0].nombre;
        console.log(" este es el estado de mantenimiento" + mantenimiento);
        if (mantenimiento != false) {
          agent.add(
            `Estimado ${nombre}, tu servicio se encuentra en una zona afectada por corte y ya esta siendo atendido por nuestros técnicos, el tiempo aproximado de reparación es de 1 a 6 horas.`
          );
        } else {
          let idClient = res.data.datos[0].id;
          console.log("este es el id " + idClient);
          let newNameNetwork = agent.parameters.ssid;
          let newPasswordp = agent.parameters.newpassword;
          return axios({
            method: "post",
            url: `${urlMikrowisp}/api/v1/NewTicket`,
            data: {
              token: `${token}`,
              idcliente: idClient,
              dp: 1,
              asunto: `Cliente ${nombre} SIN INTERNET`,
              solicitante: `${nombre}`,
              fechavisita: "2021-08-05",
              turno: "TARDE",
              agendado: "RED SOCIAL",
              contenido:
                "Hola, cliente " +
                nombre +
                " solicita revision de su servicio, ya que reporta que no cuenta con internet",
            },
          })
            .then((res) => {
              let ticket = res.data.idticket;
              agent.add(
                `Muchas gracias, se ha levantado un ticket y nuestros técnicos le darán seguimiento, su numero de ticket F-${ticket} y podrá verlo en su panel de cliente`
              );
            })
            .catch(function (error) {
              agent.add(
                "ha ocurrido un error en el ticket, por favor intentelo de nuevo más tarde"
              );
            });
        }
      })
      .catch(function (error) {
        agent.add(
          "ha ocurrido un error, por favor intentelo de nuevo más tarde"
        );
      });
  }
  function ticketNoInternet(agent) {
    let localidad = agent.parameters.localidad;
    let titular = agent.parameters.titular;
    let tnumero = agent.parameters.tnumero;
    return axios({
      method: "post",
      url: `${urlMikrowisp}/api/v1/NewTicket`,
      data: {
        token: `${token}`,
        idcliente: 3178,
        dp: 1,
        asunto: "Nuevo Ticket Cliente sin Internet",
        solicitante: "ChatBot",
        fechavisita: "2021-08-05",
        turno: "TARDE",
        agendado: "RED SOCIAL",
        contenido:
          "Hola, cliente " +
          titular +
          " con el numero " +
          tnumero +
          " reporta que no cuenta con internet en la localidad :" +
          localidad,
      },
    })
      .then((res) => {
        let ticket = res.data.idticket;
        agent.add(`Muchas gracias, se ha levantado un ticket y nuestros técnicos le darán seguimiento, 
        su numero de ticket F-${ticket} y podrá verlo en su panel de cliente`);
      })
      .catch(function (error) {
        agent.add(
          "ha ocurrido un error en el ticket, por favor intentelo de nuevo más tarde"
        );
      });
  }

  function contratar(agent) {
    let cliente = agent.parameters.cliente;
    let celular = agent.parameters.celular;
    let localidad = agent.parameters.localidad;
    return axios({
      method: "post",
      url: `${urlMikrowisp}/api/v1/NewTicket`,
      data: {
        token: `${token}`,
        idcliente: 2733535,
        dp: 1,
        asunto: "Nueva contratación",
        solicitante: "ChatBot",
        fechavisita: "2021-08-05",
        turno: "TARDE",
        agendado: "RED SOCIAL",
        contenido:
          "Hola, cliente " +
          cliente +
          " con el numero " +
          celular +
          " desea contratar en la localidad :" +
          localidad,
      },
    })
      .then((res) => {
        console.log("then del ticket");
        agent.add(
          `Muchas gracias; tus datos fueron recibidos correctamente, un ejecutivo se  pondrá en contacto contigo para brindarte información de los  servicios que tenemos en tu localidad`
        );
      })
      .catch(function (error) {
        agent.add(
          "ha ocurrido un error en el ticket, por favor intentelo de nuevo más tarde"
        );
      });
  }

  function getIDclient(agent) {
    const numero = agent.parameters.numero;
    console.log(`este es el numero en oxxo ${numero}`);
    return axios({
      method: "get",
      url: `${urlMikrowisp}/api/v1/GetClientsDetails`,
      data: {
        token: `${token}`,
        telefono: numero,
      },
    })
      .then((response) => {
        let estado = response.data.estado;
        if (estado != "exito") {
          agent.add(
            `el numero que nos proporcionaste no pertenece a ningun cliente registrado con nosotros, si deseas volver a intentar con otro numero regresa al menu principal, o puedes escribir AGENTE para esperar a ser atendido por un Asesor.`
          );
        } else {
          let idClient = response.data.datos[0].id;
          console.log(`este es el ID ${idClient}`);
          return axios({
            method: "get",
            url: `${urlMikrowisp}/api/v1/GetInvoices"`,
            data: {
              token: `${token}`,
              limit: 1,
              estado: 1,
              idcliente: idClient,
            },
          })
            .then((response) => {
              console.log(response.data.facturas[0]);
              console.log(
                "Referencia Oxxo" + response.data.facturas[0].oxxo_referencia
              );
              agent.add(
                "Monto a pagar: $" +
                  response.data.facturas[0].total +
                  "\n" +
                  "Vence : " +
                  response.data.facturas[0].vencimiento +
                  "\n" +
                  "Número de cliente: " +
                  idClient +
                  "\n" +
                  "Referencia pago OXXO: " +
                  response.data.facturas[0].oxxo_referencia +
                  "\n" +
                  "\n" +
                  "\n" +
                  "Para regresar el menú principal escriba la palabra Menú"
              );
            })
            .catch(function (error) {
              agent.add("");
              console.log(error);
            });
        }
      })
      .catch(function (error) {
        agent.add(
          "Ha ocurrido un error, por favor intentelo de nuevo o más tarde"
        );
        console.log(error);
      });
  }

  function lentitudReporteGen(agent) {
    let titular = agent.parameters.titular;
    let celular = agent.parameters.numero;
    let localidad = agent.parameters.localidad;
    return axios({
      method: "post",
      url: `${urlMikrowisp}/api/v1/NewTicket`,
      data: {
        token: `${token}`,
        idcliente: 3178,
        dp: 1,
        asunto: `Cliente ${titular} REPORTA LENTITUD`,
        solicitante: "ChatBot",
        fechavisita: "2021-08-05",
        turno: "TARDE",
        agendado: "RED SOCIAL",
        contenido:
          "Hola, cliente " +
          titular +
          " con el numero " +
          celular +
          " REPORTA LENTITUD en la localidad :" +
          localidad,
      },
    })
      .then((res) => {
        let ticket = res.data.idticket;
        agent.add(
          `Muchas gracias, se ha levantado un ticket y nuestros técnicos le darán seguimiento, su numero de ticket es F-${ticket}`
        );
      })
      .catch(function (error) {
        agent.add(
          "ha ocurrido un error en el ticket, por favor intentelo de nuevo más tarde"
        );
      });
  }

  function reportarLentitud(agent) {
    let numero = agent.parameters.numero;
    return axios({
      method: "get",
      url: `${urlMikrowisp}/api/v1/GetClientsDetails`,
      data: {
        token: `${token}`,
        telefono: numero,
      },
    })
      .then((res) => {
        let estado = res.data.estado;
        if (estado != "exito") {
          agent.add(`Este numero ${numero} no se encuentra registrado, 

si desea Levantar el reporte en este momento escriba REPORTAR
`);
        } else {
          let cliente = res.data.datos[0].nombre;
          let idClient = res.data.datos[0].id;
          console.log("este es el id " + idClient);
          return axios({
            method: "post",
            url: `${urlMikrowisp}/api/v1/NewTicket`,
            data: {
              token: `${token}`,
              idcliente: idClient,
              dp: 1,
              asunto: "Reporte de lentitud",
              solicitante: `${cliente} con el numero ${numero}`,
              fechavisita: "2021-08-05",
              turno: "TARDE",
              agendado: "RED SOCIAL",
              contenido:
                "Hola, cliente " +
                cliente +
                " con el numero: " +
                numero +
                " Reporta lentitud",
            },
          })
            .then((res) => {
              let ticket = res.data.idticket;
              agent.add(`Muchas gracias, se ha levantado un ticket y nuestros técnicos le darán seguimiento, 
        su numero de ticket F-${ticket} y podrá verlo en su panel de cliente`);
            })
            .catch(function (error) {
              agent.add(
                "ha ocurrido un error en el ticket, por favor intentelo de nuevo más tarde"
              );
            });
        }
      })
      .catch(function (error) {
        agent.add(
          "ha ocurrido un error al solicitar, por favor intentelo de nuevo más tarde"
        );
      });
  }

  function sinInternetGen(agent) {
    let titular = agent.parameters.titular;
    let celular = agent.parameters.telefono;
    let localidad = agent.parameters.localidad;
    return axios({
      method: "post",
      url: `${urlMikrowisp}/api/v1/NewTicket`,
      data: {
        token: `${token}`,
        idcliente: 3178,
        dp: 1,
        asunto: `Reporte de cliente ${titular} SIN INTERNET`,
        solicitante: "ChatBot",
        fechavisita: "2021-08-05",
        turno: "TARDE",
        agendado: "RED SOCIAL",
        contenido:
          "Hola, cliente " +
          titular +
          " con el numero " +
          celular +
          " REPORTA no contar con INTERNET en la localidad :" +
          localidad,
      },
    })
      .then((res) => {
        let ticket = res.data.idticket;
        agent.add(
          `Muchas gracias, su numero de ticket es F-${ticket}, para poder brindarle un mejor servicio agradeceriamos nos envie una foto de su modem.`
        );
      })
      .catch(function (error) {
        agent.add(
          "ha ocurrido un error en el ticket, por favor intentelo de nuevo más tarde"
        );
      });
  }

  function cambioContraGen(agent) {
    let titular = agent.parameters.titular;
    let celular = agent.parameters.telefono;
    let localidad = agent.parameters.localidad;
    let red = agent.parameters.red;
    let contra = agent.parameters.contra;
    return axios({
      method: "post",
      url: `${urlMikrowisp}/api/v1/NewTicket`,
      data: {
        token: `${token}`,
        idcliente: 3178,
        dp: 1,
        asunto: `Cliente ${titular} solicita CAMBIO DE CONTRASEÑA`,
        solicitante: `${titular} ${celular}`,
        fechavisita: "2021-08-05",
        turno: "TARDE",
        agendado: "RED SOCIAL",
        contenido:
          "Hola, cliente " +
          titular +
          " con el numero " +
          celular +
          " de la localidad " +
          localidad +
          " desea cambio de contraseña: " +
          contra +
          " Cambio de SSID: " +
          red,
      },
    })
      .then((res) => {
        let ticket = res.data.idticket;
        agent.add(
          `Muchas gracias, se ha levantado un ticket y nuestros técnicos le darán seguimiento, su numero de ticket es F-${ticket}`
        );
      })
      .catch(function (error) {
        agent.add(
          "ha ocurrido un error en el ticket, por favor intentelo de nuevo más tarde"
        );
      });
  }

  function testing(agent) {
    agent.add(new Suggestion(`Quick Reply`));
    agent.add(new Suggestion(`Suggestion`));
  }

  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  function test2(agent) {
    let title = "Hello from the Actions on Google client library";
    let quickReplies1 = "boton 1";
    let quickReplies2 = "boton 2";
    let quickReplies3 = "boton 3";

    createResponseQuickReplies(
      title,
      quickReplies1,
      quickReplies2,
      quickReplies3
    ),
      (title = "Hello from the Actions on Google client library"),
      (quickReplies1 = "boton 1"),
      (quickReplies2 = "boton 2"),
      (quickReplies3 = "boton 3");

    agent.add(new Suggestion(`puchale`));
    agent.add(new Suggestion(`puchale despacito`));
  }

  function myService(agent) {
    let numero = agent.parameters.numero;
    return axios({
      method: "get",
      url: `${urlMikrowisp}/api/v1/GetClientsDetails`,
      data: {
        token: `${token}`,
        telefono: numero,
      },
    })
      .then((response) => {
        let estado = response.data.estado;
        if (estado != "exito") {
          agent.add(
            `El número que nos proporcionaste no pertenece a ningún cliente registrado con nosotros, si desea Levantar el reporte en este momento escriba CAMBIAR 
`
          );
        } else {
          let cliente = response.data.datos[0].nombre;
          agent.add(
            `El numero esta registrado a nombre de ${cliente} es correcto?
SI
NO`
          );
        }
      })
      .catch(function (error) {
        agent.add(
          "UPS, hay un error en el servidor, por favor intentelo de nuevo mas tarde"
        );
        console.log(error);
      });
  }

  function getClientData(agent) {
    let numero = agent.parameters.numero;
    return axios({
      method: "get",
      url: `${urlMikrowisp}/api/v1/GetClientsDetails`,
      data: {
        token: `${token}`,
        telefono: numero,
      },
    })
      .then((response) => {
        let estado = response.data.estado;
        if (estado != "exito") {
          agent.add(
            `El número que nos proporcionaste no pertenece a ningún cliente registrado con nosotros, si desea Levantar el reporte en este momento escriba CAMBIAR 
`
          );
        } else {
          let cliente = response.data.datos[0].nombre;
          let servicio = response.data.datos[0].mantenimiento;
          let direccion = response.data.datos[0].direccion_principal;
          let facturas = response.data.datos[0].facturacion.facturas_nopagadas;
          let total = response.data.datos[0].facturacion.total_facturas;
          if (servicio != "true") {
            if (facturas === 0) {
              agent.add(`Estos son sus datos de cliente registrado
            Nombre: ${cliente}
            Direccion: ${direccion}
            
            Actualmente su cuenta se encuentra al corriente
            elija una de las siguientes opciones:
            SOPORTE
            SUCURSALES
            FACTURACION`);
            } else {
              agent.add(`Estos son sus datos de cliente registrado
            Nombre: ${cliente}
            Direccion: ${direccion}
            
            Usted cuenta con ${facturas} factura(s) no pagada(s)
            por un total de: $${total}
            elija una de las siguientes opciones:
            SOPORTE
            SUCURSALES
            FACTURACION`);
            }
          } else {
            agent.add(`Estimado cliente ${cliente} en este momento
            su servicio se encuentra en MANTENIMIENTO por lo que no es necesario reportarlo.`);
          }
        }
      })
      .catch(function (error) {
        agent.add(
          "UPS, hay un error en el servidor, por favor intentelo de nuevo mas tarde"
        );
        console.log(error);
      });
  }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }
  // // See https://github.com/dialogflow/fulfillment-actions-library-nodejs
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  // Run the proper function handler based on the matched Dialogflow intent name

  function createResponseQuickReplies() {
    let response = {
      fulfillmentMessages: [
        {
          quickReplies: {
            title: ["titulo intent"],
            quickReplies: ["boton1", "boton2", "boton3"],
          },
        },
      ],
    };
    return response;
  }
  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set(
    "Default Welcome Intent - 1Soporte - 1Contraseña",
    changePasword
  );
  intentMap.set(
    "Default Welcome Intent - 1Soporte - 1Contraseña - yes",
    newPassword
  ); //63
  intentMap.set(
    "Default Welcome Intent - 1Soporte - 1Contraseña - 2 LevantarT",
    ticketPassword
  );
  intentMap.set("Default Welcome Intent - 1Soporte - 2SinInternet", noInternet); //130
  intentMap.set(
    "Default Welcome Intent - 1Soporte - 2SinInternet - yes",
    ticketNointernetyes
  ); //210
  intentMap.set("Default Welcome Intent - 2Contratar", contratar);
  intentMap.set("Default Welcome Intent - 4Pagar - 3Oxxo", getIDclient);
  intentMap.set(
    "Default Welcome Intent - 1Soporte - 3Lentitud - yes",
    reportarLentitud
  ); //350
  intentMap.set(
    "Default Welcome Intent - 1Soporte - 3Lentitud - NoYesLentitud",
    lentitudReporteGen
  ); //324
  intentMap.set(
    "Default Welcome Intent - 1Soporte - 2SinInternet - ReporteGen",
    sinInternetGen
  );
  intentMap.set(
    "Default Welcome Intent - 1Soporte - 1Contraseña - ContraGen - yes",
    cambioContraGen
  );
  intentMap.set("Default Welcome Intent - 1Soporte - 4miservicio", myService);
  intentMap.set(
    "Default Welcome Intent - 1Soporte - 4miservicio - yes",
    getClientData
  );
  intentMap.set("test", createResponseQuickReplies);
  agent.handleRequest(intentMap);
};
