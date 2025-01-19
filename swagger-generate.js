const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger-output.json"; // output file
const endpointsFiles = ["./server.js"]; // API endpoints file

swaggerAutogen(outputFile, endpointsFiles).then(() => {
  console.log("Swagger documentation generated");
});
