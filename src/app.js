require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || "3003";
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const apiRouter = require("./routes");
const cors = require("cors");

app.use(cors());

app.use(express.json());

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "MyCv API",
            version: "1.0.0",
        },
    },
    apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
        console.log("Database connected");
    })
    .catch((error) => {
        console.log(`Database connection error ${error}`);
    });

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use("/api/", apiRouter);

app.listen(port, () => {
    console.log("server is running");
});
