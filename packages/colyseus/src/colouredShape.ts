// const shapes = ["ghost", "mouse", "chair", "bottle", "book"];
// const colours = ["white", "grey", "red", "green", "blue"];

interface ColouredShape {
  colour: string;
  shape: string;
}

////////////////////////////////////////////////////////////////////////////////
// const getColouredShapes = (colour: string): ColouredShape[] => {
//   const getColouredShape = (shape: string): ColouredShape => ({
//     colour,
//     shape,
//   });

//   return shapes.map(getColouredShape);
// };

// const all = colours.map(getColouredShapes).flatten();

////////////////////////////////////////////////////////////////////////////////
// const randomColouredShape = (colouredShapes: ColouredShape[]): ColouredShape =>
//   colouredShapes[Math.floor(Math.random() * colouredShapes.length)];

// const valid: ColouredShape[] = [
//   { colour: "white", shape: "ghost" },
//   { colour: "grey", shape: "mouse" },
//   { colour: "red", shape: "chair" },
//   { colour: "green", shape: "bottle" },
//   { colour: "blue", shape: "book" },
// ];

////////////////////////////////////////////////////////////////////////////////
// const target = randomColouredShape(valid);

////////////////////////////////////////////////////////////////////////////////
// const invalidColouredShapes = (colouredShape: ColouredShape): boolean =>
//   colouredShape.colour != target.colour && colouredShape.shape != target.shape;

////////////////////////////////////////////////////////////////////////////////

// const invalid: ColouredShape[] = all.filter(invalidColouredShapes);

////////////////////////////////////////////////////////////////////////////////
// export const card = [
//   randomColouredShape(invalid),
//   randomColouredShape([randomColouredShape(invalid), target]),
// ];
