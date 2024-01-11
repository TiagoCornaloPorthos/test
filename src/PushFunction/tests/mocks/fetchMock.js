const jsonMock = jest.fn(() => Promise.resolve({}))
  .mockResolvedValueOnce("")
  .mockResolvedValueOnce({ data: { items: [] } });
const fetchMock = jest.fn().mockResolvedValue({ json: jsonMock });

module.exports = fetchMock;
