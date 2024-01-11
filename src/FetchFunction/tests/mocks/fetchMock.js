const fetchMock = jest.fn()
  .mockResolvedValueOnce({ data: { items: [] } })
;

module.exports = fetchMock;
