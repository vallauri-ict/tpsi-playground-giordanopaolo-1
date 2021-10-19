import * as _http from "http"
const {Dispatcher} from "./Dispatcher"
const HEADERS from "./headers.json"

const PORT :number = 1337;

const server = _http.createServer(function (req, res) {
    dispatcher.dispatch(req, res);
});

server.listen(PORT);
console.log(`Il server è in ascolto sulla porta ${PORT}`);