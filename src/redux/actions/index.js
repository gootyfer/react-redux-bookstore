const actionTypes = {
  CREATE_BOOK: 'CREATE_BOOK',
  REMOVE_BOOK: 'REMOVE_BOOK',
  CHANGE_FILTER: 'CHANGE_FILTER',
  LOAD_BOOKS: 'LOAD_BOOKS',
};

const createBook = (book) => ({
  type: actionTypes.CREATE_BOOK,
  book,
});

const removeBook = (book) => ({
  type: actionTypes.REMOVE_BOOK,
  book,
});

const changeFilter = (filter) => ({
  type: actionTypes.CHANGE_FILTER,
  filter,
});

const getRandomBooks = (categories) => {
  const fetchCategory = async (category) => {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=subject:${category}&maxResults=40`
    );
    return response.json();
  };
  return (dispatch) => {
    Promise.all(categories.map(fetchCategory)).then((booksByCategory) => {
      const books = booksByCategory
        .map(({ items }, index) =>
          items
            .filter(
              ({ volumeInfo: { imageLinks: { smallThumbnail = '' } = {} } }) =>
                smallThumbnail !== ''
            )
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.floor(Math.random() * 3 + 1))
            .map(
              ({
                id,
                volumeInfo: {
                  title,
                  imageLinks: { smallThumbnail },
                },
              }) => ({
                id,
                title,
                thumbnail: smallThumbnail.replace(/^http:/, 'https:'),
                category: categories[index],
              })
            )
        )
        .flat();
      dispatch({ type: actionTypes.LOAD_BOOKS, books });
    });
  };
};

export { createBook, removeBook, changeFilter, getRandomBooks, actionTypes };
