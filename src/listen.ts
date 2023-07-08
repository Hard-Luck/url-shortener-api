import app from '.';

const PORT = process.env.PORT || 9630;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  console.log(`http://localhost:${PORT}/`);
});
