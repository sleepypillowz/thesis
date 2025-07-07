export default function Page() {
  const test = [
    {
      id: 1,
      header: "Map",
      text: "Hello World",
    },
    // You can add more items here
  ];

  return (
    <>
      {test.map((item) => (
        <div key={item.id}>
          <h1>{item.header}</h1>
          <span>{item.text}</span>
        </div>
      ))}
    </>
  );
}
