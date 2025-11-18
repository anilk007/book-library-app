// package: book
// file: src/proto/book/book.proto

var src_proto_book_book_pb = require("../../../src/proto/book/book_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var BookService = (function () {
  function BookService() {}
  BookService.serviceName = "book.BookService";
  return BookService;
}());

BookService.CreateBook = {
  methodName: "CreateBook",
  service: BookService,
  requestStream: false,
  responseStream: false,
  requestType: src_proto_book_book_pb.CreateBookRequest,
  responseType: src_proto_book_book_pb.CreateBookResponse
};

exports.BookService = BookService;

function BookServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

BookServiceClient.prototype.createBook = function createBook(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(BookService.CreateBook, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.BookServiceClient = BookServiceClient;

