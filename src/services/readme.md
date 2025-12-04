
protoc \
  --js_out=import_style=typescript,binary:src/pb \
  --grpc-web_out=import_style=typescript,mode=grpcweb:src/pb \
  src/proto/book/book.proto