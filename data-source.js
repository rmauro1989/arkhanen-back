"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const book_entity_1 = require("./src/entities/book.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities: [book_entity_1.Book],
    synchronize: true,
    ssl: {
        rejectUnauthorized: false,
    },
});
//# sourceMappingURL=data-source.js.map