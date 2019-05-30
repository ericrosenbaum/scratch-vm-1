const formatMessage = require('format-message');
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const fs = window.require('fs');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCA0MCI+PHN0eWxlPi5zdDJ7ZmlsbDpyZWR9LnN0M3tmaWxsOiNlMGUwZTB9LnN0NHtmaWxsOm5vbmU7c3Ryb2tlOiM2NjY7c3Ryb2tlLXdpZHRoOi41O3N0cm9rZS1taXRlcmxpbWl0OjEwfTwvc3R5bGU+PHBhdGggZD0iTTM1IDI4SDVhMSAxIDAgMCAxLTEtMVYxMmMwLS42LjQtMSAxLTFoMzBjLjUgMCAxIC40IDEgMXYxNWMwIC41LS41IDEtMSAxeiIgZmlsbD0iI2ZmZiIgaWQ9IkxheWVyXzYiLz48ZyBpZD0iTGF5ZXJfNCI+PHBhdGggY2xhc3M9InN0MiIgZD0iTTQgMjVoMzJ2Mi43SDR6TTEzIDI0aC0yLjJhMSAxIDAgMCAxLTEtMXYtOS43YzAtLjYuNC0xIDEtMUgxM2MuNiAwIDEgLjQgMSAxVjIzYzAgLjYtLjUgMS0xIDF6Ii8+PHBhdGggY2xhc3M9InN0MiIgZD0iTTYuMSAxOS4zdi0yLjJjMC0uNS40LTEgMS0xaDkuN2MuNSAwIDEgLjUgMSAxdjIuMmMwIC41LS41IDEtMSAxSDcuMWExIDEgMCAwIDEtMS0xeiIvPjxjaXJjbGUgY2xhc3M9InN0MiIgY3g9IjIyLjgiIGN5PSIxOC4yIiByPSIzLjQiLz48Y2lyY2xlIGNsYXNzPSJzdDIiIGN4PSIzMC42IiBjeT0iMTguMiIgcj0iMy40Ii8+PHBhdGggY2xhc3M9InN0MiIgZD0iTTQuMiAyN2gzMS45di43SDQuMnoiLz48L2c+PGcgaWQ9IkxheWVyXzUiPjxjaXJjbGUgY2xhc3M9InN0MyIgY3g9IjIyLjgiIGN5PSIxOC4yIiByPSIyLjMiLz48Y2lyY2xlIGNsYXNzPSJzdDMiIGN4PSIzMC42IiBjeT0iMTguMiIgcj0iMi4zIi8+PHBhdGggY2xhc3M9InN0MyIgZD0iTTEyLjUgMjIuOWgtMS4yYy0uMyAwLS41LS4yLS41LS41VjE0YzAtLjMuMi0uNS41LS41aDEuMmMuMyAwIC41LjIuNS41djguNGMwIC4zLS4yLjUtLjUuNXoiLz48cGF0aCBjbGFzcz0ic3QzIiBkPSJNNy4yIDE4Ljd2LTEuMmMwLS4zLjItLjUuNS0uNWg4LjRjLjMgMCAuNS4yLjUuNXYxLjJjMCAuMy0uMi41LS41LjVINy43Yy0uMyAwLS41LS4yLS41LS41ek00IDI2aDMydjJINHoiLz48L2c+PGcgaWQ9IkxheWVyXzMiPjxwYXRoIGNsYXNzPSJzdDQiIGQ9Ik0zNS4yIDI3LjlINC44YTEgMSAwIDAgMS0xLTFWMTIuMWMwLS42LjUtMSAxLTFoMzAuNWMuNSAwIDEgLjQgMSAxVjI3YTEgMSAwIDAgMS0xLjEuOXoiLz48cGF0aCBjbGFzcz0ic3Q0IiBkPSJNMzUuMiAyNy45SDQuOGExIDEgMCAwIDEtMS0xVjEyLjFjMC0uNi41LTEgMS0xaDMwLjVjLjUgMCAxIC40IDEgMVYyN2ExIDEgMCAwIDEtMS4xLjl6Ii8+PC9nPjwvc3ZnPg==';

/**
 * Class for the makey makey blocks in Scratch 3.0
 * @constructor
 */
class Scratch3PiGPIOBlocks {
    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME () {
        return 'Raspberry Pi GPIO';
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID () {
        return 'pigpio';
    }
    
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

    }


    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: Scratch3PiGPIOBlocks.EXTENSION_ID,
            name: Scratch3PiGPIOBlocks.EXTENSION_NAME,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'set_gpio',
                    text: formatMessage({
                        id: 'pigpio.set_gpio',
                        default: 'set gpio [GPIO] to [OUTPUT]',
                        description: 'set gpio to value'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        GPIO: {
                            type: ArgumentType.STRING,
                            menu: 'gpios',
                            defaultValue: '0'
                        },
                        OUTPUT: {
                            type: ArgumentType.STRING,
                            menu: 'outputs',
                            defaultValue: 'input'
                        }
                    }
                },
                {
                    opcode: 'get_gpio',
                    text: formatMessage({
                        id: 'pigpio.get_gpio',
                        default: 'gpio [GPIO] is high?',
                        description: 'is the selected gpio high?'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        GPIO: {
                            type: ArgumentType.STRING,
                            menu: 'gpios',
                            defaultValue: '0'
                        },
                    }
                },
            ],
            menus: {
                outputs: ['output high', 'output low', 'input'],
                gpios: ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27'],
            }
        };
    }

    set_gpio (args) 
    {
        const pin = Cast.toNumber(args.GPIO);
        const val = Cast.toString(args.OUTPUT);

	//console.log ("set_gpio")
	//console.log (pin)
	//console.log (val)

        if (pin === '' || pin < 0 || pin > 27) return;
        var dir = 0, lev;
        if (val == 'output high') lev = 1;
        else if (val == 'output low') lev = 0;
        else dir = 1;

	//console.log (dir)
	//console.log (lev)

	// check the pin is exported
	if (!fs.existsSync("/sys/class/gpio/gpio" + pin)) 
		fs.writeFileSync("/sys/class/gpio/export", pin, "utf8");

	// the ownership of direction takes time to establish, so try this until it succeeds
	while (true)
	{
		try {
			fs.writeFileSync("/sys/class/gpio/gpio" + pin + "/direction", dir == 0 ? "out" : "in", "utf8");
			break;
		}
		catch (error) {
			continue;
		}
	}

	// set the output value
        if (dir == 0)
            fs.writeFileSync("/sys/class/gpio/gpio" + pin + "/value", lev == 1 ? "1" : "0", "utf8");
    };

    get_gpio (args) 
    {
        const pin = Cast.toNumber(args.GPIO);

	//console.log ("get_gpio")
	//console.log (pin)

        if (pin === '' || pin < 0 || pin > 27) return;

	// check the pin is exported
	if (!fs.existsSync("/sys/class/gpio/gpio" + pin)) 
		fs.writeFileSync("/sys/class/gpio/export", pin);

	// read the pin value
	var data = fs.readFileSync ("/sys/class/gpio/gpio" + pin + "/value", 'utf8');
	console.log (data)
	if (data.slice(0,1) == "1") return true;
	else return false;
    };

}
module.exports = Scratch3PiGPIOBlocks;
