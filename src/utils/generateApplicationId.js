const generateApplicationId = () => {

  const timestamp = Date.now();

  const random =
    Math.floor(
      1000 + Math.random() * 9000
    );

  return `APP-${timestamp}-${random}`;

};

export default generateApplicationId;