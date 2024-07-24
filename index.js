const terminal = new Terminal();
        const fitAddon = new FitAddon.FitAddon();
        terminal.loadAddon(fitAddon);

        terminal.open(document.getElementById('terminal'));
        fitAddon.fit();

        let inputBuffer = '';
        let gameRunning = true;

        terminal.write('Rock, Paper, Scissors Game - Enter your choice (r/p/s):\r\n');

        terminal.onData(data => {
            if (data.charCodeAt(0) === 13) {
                if (gameRunning) {
                    processInput();
                } else {
                    handleReplayInput();
                }
            } else {
                terminal.write(data);
                inputBuffer += data;
            }
        });

        function processInput() {
            const userChoice = inputBuffer.trim().toLowerCase();
            if (['r', 'p', 's'].includes(userChoice)) {
                playGame(userChoice);
            } else {
                terminal.write('\r\nInvalid choice. Please enter \'r\', \'p\', or \'s\'.\r\n');
                terminal.write('Enter your choice (r/p/s): ');
            }
            inputBuffer = '';
        }

        function playGame(userChoice) {
            const choices = ['r', 'p', 's'];
            const choiceNames = { 'r': 'Rock', 'p': 'Paper', 's': 'Scissors' };
            const randomIndex = Math.floor(Math.random() * 3);
            const computerChoice = choices[randomIndex];

            const userText = choiceNames[userChoice];
            const computerText = choiceNames[computerChoice];
            const result = determineResult(userText, computerText);

            terminal.write('\r\n'+result.message + '\r\n');
            terminal.write(`\r\nYou chose: ${userText}\r\n`);
            terminal.write(`Computer chose: ${computerText}\r\n`);
            
            
            terminal.write('\r\nWanna Play Again (y/n)? ');
            gameRunning = false;
        }

        function handleReplayInput() {
            const replayChoice = inputBuffer.trim().toLowerCase();
            if (replayChoice === 'y') {
                terminal.write('\r\nRock, Paper, Scissors Game - Enter your choice (r/p/s): \r\n');
                terminal.write('> ');
                gameRunning = true;
            } else if (replayChoice === 'n') {
                terminal.write('\r\n'+colorText("Thank you for playing!",'cyan')+'\r\n');
                terminal.write('\r\n(Reload the page to play again)\r\n');
                terminal.write('> '); // Prompt
                return;
            } else {
                terminal.write('\r\nInvalid choice. Please enter \'y\' or \'n\'.\r\n');
                terminal.write('Wanna Play Again (y/n)? ');
                terminal.write('> ');
            }
            inputBuffer = '';
        }

        function determineResult(userChoice, computerChoice) {
            if ((userChoice === 'Rock' && computerChoice === 'Scissors') ||
                (userChoice === 'Paper' && computerChoice === 'Rock') ||
                (userChoice === 'Scissors' && computerChoice === 'Paper')) {
                return { message: colorText('You Won!', 'green') };
            } else if (userChoice === computerChoice) {
                return { message: colorText('Game Tied!', 'yellow') };
            } else {
                return { message: colorText('You Lost!', 'red') };
            }
        }

        function colorText(text, color) {
            const colors = {
                black: '30',
                red: '31',
                green: '32',
                yellow: '33',
                blue: '34',
                magenta: '35',
                cyan: '36',
                white: '37',
                reset: '0'
            };

            const colorCode = colors[color] || colors.reset;
            return `\x1b[${colorCode}m${text}\x1b[${colors.reset}m`;
        }

        terminal.write('> ');