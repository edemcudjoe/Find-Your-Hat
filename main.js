const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(fieldArr) {
        this._fieldArr = fieldArr;
    }

    get fieldArr () {
        return this._fieldArr;
    }

    // */ method to print playing field
    print() {
        let fieldJoiner = [];
        // This joins the inner arrays and then pushes them to the fieldJoiner array
        for (let fieldRow of this._fieldArr) {
            fieldJoiner.push(fieldRow.join(''));
        }

        // This joins the fieldJoiner by separating the rows with a newline
        let fieldPrinter = fieldJoiner.join('\n');
        return fieldPrinter; 
    }

    // This method finds helps to find the pathCharacter in the current board so the game knows where to start from
    gameCharacterIndexLocator() {
        // looping through game rows
        for (let i = 0; i < this._fieldArr.length; i++) {
            let index1 = i;
            let index2;

            // checking if row contains the path character
            index2 = this._fieldArr[i].indexOf(pathCharacter)

            // if it does, it returns an object indicating the row and column to locate the pathCharacter
            if (index2 != -1) {
                let indexObj;
                return indexObj = {
                    firstIndex: index1, 
                    secondIndex: index2
                }
                break
            } else {
                continue
            }
        }
    }

    // This method runs the main part of the game, checking for all possible scenarios
    gameplayValidator(currentIndex1, currentIndex2) {

        // checking to see if row and column of current move falls in the bounds of the current game
        if ((currentIndex1 >= 0 && currentIndex1 < this._fieldArr.length) && (currentIndex2 >= 0 && currentIndex2 < this._fieldArr.length)) {
            let currentLocationCharacter = this._fieldArr[currentIndex1][currentIndex2];
            switch (currentLocationCharacter) {
                case fieldCharacter:
                    this._fieldArr[currentIndex1][currentIndex2] = pathCharacter;
                    console.log(this.print())
                    break;
                case hole:
                    console.log('Sorry. You fell down a hole.');
                    process.exit();
                    break;
                case hat:
                    console.log('Congratulations. You found your hat.');
                    process.exit();
                    break;
                case 'undefined':
                    console.log('Out of Bounds');
                    process.exit();
                    break;
            }
        } else {
            console.log('Out of Bounds');
            process.exit();
        }
    }

    // * This static method generates a randomized playing field with from height and width specified in parameters.
    // This also takes a third argument to specify the percentage of holes in the playing field
    static generateField(height, width, holePercentage = 30) {
        let mainArray = [];
        let innerArray = [];
        let fieldCharacterCounter = 0;
        let holeCharacterCounter = 0;
        let maxHoleNumber = (holePercentage / 100) * (height * width);
        
        
        // for loop that inserts playing field characters based on the height, width and percentage of holes specified
        for (let i = 0; i < height; i++) {
            mainArray.push(innerArray);
            for (let j = 0; mainArray[i].length < width; j = mainArray[i].length) {
                let randomNum = Math.floor(Math.random() * 101);
                if (randomNum <= (100 - holePercentage)) {
                    mainArray[i].push(fieldCharacter)
                    fieldCharacterCounter += 1;
                } else {
                    if (holeCharacterCounter >= maxHoleNumber) {
                        continue;
                    } else {
                        mainArray[i].push(hole)
                        holeCharacterCounter += 1;
                    }
                    
                }
            }
            innerArray = [];
        }
    
        // inserting pathCcharacter into random location on playing field
        let pathCharRow = Math.floor(Math.random() * height);
        let pathCharCol = Math.floor(Math.random() * width);
        mainArray[pathCharRow][pathCharCol] = pathCharacter;
    
        // inserting hat character into random location on playing field
        let hatCharRow = Math.floor(Math.random() * height);
        let hatCharCol = Math.floor(Math.random() * width);
        mainArray[hatCharRow][hatCharCol] = hat;
    
        return mainArray;
    }
}


// initializing an instance of the class with the static field generator method to display a random playing field
const myField = new Field(Field.generateField(10, 10, 35));

// getting the position of the pathCharacter from the field
let startingLocation = myField.gameCharacterIndexLocator();
let currentFirstIndex = startingLocation.firstIndex;
let currentSecondIndex = startingLocation.secondIndex;

// Printing out gameplay info to console
process.stdout.write(myField.print());
process.stdout.write('\n');
process.stdout.write("To move use 'l' for left, 'r', for right, 'u' for up and 'd' for down");
process.stdout.write('\n');

// Input listener that takes user input and reflects the gameplay changes
process.stdin.on('data', (data) => {
    const input = data.toString().trim()

    // in game movement checker and validation
    if (input === 'd' || input === 'D') {
        currentFirstIndex += 1;    
        myField.gameplayValidator(currentFirstIndex, currentSecondIndex);
        process.stdout.write('Enter direction...');
    } else if (input === 'u' || input === 'U') {
        currentFirstIndex -= 1;
        myField.gameplayValidator(currentFirstIndex, currentSecondIndex);
        process.stdout.write('Enter direction...');
    } else if (input === 'r' || input === 'R') {
        currentSecondIndex += 1;
        myField.gameplayValidator(currentFirstIndex, currentSecondIndex);
        process.stdout.write('Enter direction...');
    } else if (input === 'l' || input === 'L') {
        currentSecondIndex -= 1;
        myField.gameplayValidator(currentFirstIndex, currentSecondIndex);
        process.stdout.write('Enter direction...');
    } else {
        myField.gameplayValidator(currentFirstIndex, currentSecondIndex);
        process.stdout.write('Enter a valid input...');
    }

})
