import {Card, CardBody, CardFooter, Image} from "@nextui-org/react";

export default function App() {
  const list = [
    {
      title: "Burguer",
      img: "https://assets.unileversolutions.com/recipes-v2/210995.jpg",
      price: "$5.50",
    },
    {
      title: "Burguer",
      img: "https://assets.unileversolutions.com/recipes-v2/210995.jpg",
      price: "$3.00",
    },
    {
      title: "Burguer",
      img: "https://assets.unileversolutions.com/recipes-v2/210995.jpg",
      price: "$10.00",
    },
    {
      title: "Burguer",
      img: "https://assets.unileversolutions.com/recipes-v2/210995.jpg",
      price: "$5.30",
    },
    {
      title: "Burguer",
      img: "https://assets.unileversolutions.com/recipes-v2/210995.jpg",
      price: "$15.70",
    },
    {
      title: "Burguer",
      img: "https://assets.unileversolutions.com/recipes-v2/210995.jpg",
      price: "$8.00",
    },
    {
      title: "Burguer",
      img: "https://assets.unileversolutions.com/recipes-v2/210995.jpg",
      price: "$7.50",
    },
    {
      title: "Burguer",
      img: "https://assets.unileversolutions.com/recipes-v2/210995.jpg",
      price: "$12.20",
    },
  ];

  return (
    <div className="gap-10 grid grid-cols-1 sm:grid-cols-5">
      {list.map((item, index) => (
        /* eslint-disable no-console */
        <Card key={index} isPressable shadow="sm" onPress={() => console.log("item pressed")}>
          <CardBody className="overflow-visible p-0">
            <Image
              alt={item.title}
              className="w-full object-cover h-[250px]"
              radius="lg"
              shadow="sm"
              src={item.img}
              width="100%"
            />
          </CardBody>
          <CardFooter className="text-small justify-between">
            <b>{item.title}</b>
            <p className="text-default-500">{item.price}</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}