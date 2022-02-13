const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const id = nanoid(16);

  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const finished = (pageCount, readPage) => {
    if (pageCount === readPage) {
      return true;
    }
    return false;
  };

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished: finished(pageCount, readPage),
    id,
    insertedAt,
    updatedAt,
  };
  books.push(newBook);

  if (!("name" in newBook && newBook.name !== undefined)) {
    const response = h
      .response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      })
      .code(400);
    return response;
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: "fail",
        message:
          "Gagal menambahkan buku. Mohon isi readPage yang lebih kecil dari pageCount",
      })
      .code(400);
  }

  const isSuccess = books.filter((book) => book.id == id).length > 0;
  if (isSuccess) {
    const response = h
      .response({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
          bookId: id,
        },
      })
      .code(201);
    return response;
  }

  return h
    .response({
      status: "error",
      message: "Buku gagal ditambahkan",
    })
    .code(500);
};

const getAllBooksHandler = () => ({
  status: "success",
  message: "Berhasil mengambil semua buku",
});

module.exports = { addBookHandler, getAllBooksHandler };
