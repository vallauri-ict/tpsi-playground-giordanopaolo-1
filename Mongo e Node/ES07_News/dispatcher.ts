import * as http from "http";
import * as url from "url";
import * as fs from "fs";
import * as mime from "mime";
import * as querystring from "query-string";
import HEADERS from "./headers.json";
let paginaErrore: string;

export class Dispatcher {
  prompt: string = "===> ";
  listeners: any = { 
    GET: {}, 
    POST: {}, 
    DELETE: {}, 
    PATCH: {}, 
    PUT: {} 
};

  constructor() {
    init();
  }

  addListener(method: string, resource: string, callback: any) {
    method = method.toUpperCase();

    if (method in this.listeners) {
      this.listeners[method][resource] = callback;

    } else throw new Error("Invalid method");
    
  }
  dispatch(req: http.IncomingMessage, res: http.ServerResponse): void {
    let method = req.method.toUpperCase();
    if (method === "GET") 
      this.innerDispatch(req, res);
    else {
      let bodyParams: string | object = "";
      req.on("data", function (data) {
        bodyParams = (bodyParams as string).concat(data);
      });
      req.on("end", () => {
        //  se i parametri sono JSON, va a buon fine, altrimenti passo nel catch (URL-ENCODED)
        try {
          bodyParams = JSON.parse(bodyParams as string);
        } catch (error) {
          bodyParams = querystring.parse(bodyParams as string);
        } finally {
          
          req["BODY"] = bodyParams;
          this.innerDispatch(req, res);
        }
      });
    }
  }
  innerDispatch(req: http.IncomingMessage, res: http.ServerResponse): void {
    let method = req.method;
    let reqUrl = url.parse(req.url, true);
    let resource = reqUrl.pathname;
    let parameters = reqUrl.query;
    req["GET"] = parameters;

    console.log(
      req["BODY"]
        ? `${this.prompt} ${method}: ${resource} ${JSON.stringify(
            parameters
          )} ${JSON.stringify(req["BODY"])}`
        : `${this.prompt} ${method}: ${resource} ${JSON.stringify(parameters)}`
    );

    if (resource.startsWith("/api/")) {
      if (resource in this.listeners[method]) {
        let callback = this.listeners[method][resource];
        callback(req, res);
      } else {
        res.writeHead(404, HEADERS.text);
        res.write("Servizio non trovato");
        res.end();
      }
    } else {
      staticListener(req, res, resource);
    }
  }
}

function init() {
  fs.readFile("./static/error.html", (error, data) => {
    if (!error) {
      paginaErrore = data.toString();
    } else {
      paginaErrore = "<h1> Pagina richiesta non trovata </h1>";
    }
  });
}

function staticListener(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  resource: string
) {
  if (resource == "/") {
    resource = "/index.html";
  }
  resource = "./static".concat(resource);
  let data = fs.readFile(resource, (error, data) => {
    if (!error) {
      res.writeHead(200, { "Content-Type": mime.getType(resource) });
      res.write(data);
      res.end();
    } else {
      console.error(`ERROR! Code:${error.code} - ${error.message}`);
      res.writeHead(200, HEADERS.html);
      res.write(paginaErrore);
      res.end();
    }
  });
}

