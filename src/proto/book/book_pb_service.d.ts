// package: book
// file: src/proto/book/book.proto

import * as src_proto_book_book_pb from "../../../src/proto/book/book_pb";
import {grpc} from "@improbable-eng/grpc-web";

type BookServiceCreateBook = {
  readonly methodName: string;
  readonly service: typeof BookService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof src_proto_book_book_pb.CreateBookRequest;
  readonly responseType: typeof src_proto_book_book_pb.CreateBookResponse;
};

export class BookService {
  static readonly serviceName: string;
  static readonly CreateBook: BookServiceCreateBook;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class BookServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  createBook(
    requestMessage: src_proto_book_book_pb.CreateBookRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: src_proto_book_book_pb.CreateBookResponse|null) => void
  ): UnaryResponse;
  createBook(
    requestMessage: src_proto_book_book_pb.CreateBookRequest,
    callback: (error: ServiceError|null, responseMessage: src_proto_book_book_pb.CreateBookResponse|null) => void
  ): UnaryResponse;
}

