export const generateRandomNumber: ()=>number = () => {
    // Generate a random number between 100000 and 999999
    let randomNumber: number = Math.floor(Math.random() * 900000) + 100000;
  
    // Ensure the number doesn't start with 0
    while (String(randomNumber).charAt(0) === "0") {
      randomNumber = Math.floor(Math.random() * 900000) + 100000;
    }
  
    return randomNumber;
  }