const formatMessage = require('format-message');
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const fs = window.require('fs');
const cp = window.require('child_process');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmlld0JveD0iMCAwIDY4NC43ODUyOSA2ODQuNzg1MjkiCiAgIGlkPSJzdmcyIgogICB2ZXJzaW9uPSIxLjEiCiAgIGlua3NjYXBlOnZlcnNpb249IjAuOTEgcjEzNzI1IgogICBzb2RpcG9kaTpkb2NuYW1lPSJsZWQtMTUzODgzbS5zdmciCiAgIHdpZHRoPSI2ODQuNzg1MjgiCiAgIGhlaWdodD0iNjg0Ljc4NTI4Ij4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGEzMCI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgICA8ZGM6dGl0bGU+PC9kYzp0aXRsZT4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBib3JkZXJvcGFjaXR5PSIxIgogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiCiAgICAgZ3VpZGV0b2xlcmFuY2U9IjEwIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxMjI4IgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9Ijg3MSIKICAgICBpZD0ibmFtZWR2aWV3MjgiCiAgICAgc2hvd2dyaWQ9ImZhbHNlIgogICAgIGZpdC1tYXJnaW4tdG9wPSIyMDAiCiAgICAgZml0LW1hcmdpbi1sZWZ0PSIwIgogICAgIGZpdC1tYXJnaW4tcmlnaHQ9IjAiCiAgICAgZml0LW1hcmdpbi1ib3R0b209IjAiCiAgICAgaW5rc2NhcGU6em9vbT0iMC4yMjQyNTczOSIKICAgICBpbmtzY2FwZTpjeD0iMTcwLjEyMzMzIgogICAgIGlua3NjYXBlOmN5PSIxNjUuMTUzNiIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMzc1IgogICAgIGlua3NjYXBlOndpbmRvdy15PSIyMSIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIwIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzIiIC8+CiAgPGRlZnMKICAgICBpZD0iZGVmczQiPgogICAgPHJhZGlhbEdyYWRpZW50CiAgICAgICBpZD0iYSIKICAgICAgIGN4PSI2NzQuODkwMDEiCiAgICAgICBjeT0iNDQzLjYyIgogICAgICAgcj0iOTYuMDQ2OTk3IgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgtMi40NDY1MzUyLDIuMzU0MTU3NywtMi4wMDI5NzA3LC0yLjI3NTk4NjIsMjg3Ny43NTQ5LC0yODcuOTY2NjgpIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcAogICAgICAgICBzdG9wLWNvbG9yPSIjZjAwIgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wNyIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3RvcC1jb2xvcj0iI2YwMCIKICAgICAgICAgc3RvcC1vcGFjaXR5PSIwIgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wOSIgLz4KICAgIDwvcmFkaWFsR3JhZGllbnQ+CiAgICA8cmFkaWFsR3JhZGllbnQKICAgICAgIGlkPSJiIgogICAgICAgY3g9IjMzNy4yMDk5OSIKICAgICAgIGN5PSI0NzguMTQ5OTkiCiAgICAgICByPSI5MS4xNDM5OTciCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMDc1NjUsMi4xNjQ4LC0zLjg2NjgsMC4xMzUxMywyMTgzLjM0MjYsLTY5NS44Mzk0MikiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0b3AtY29sb3I9IiNmZmYiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3AxMiIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3RvcC1jb2xvcj0iI2ZmZiIKICAgICAgICAgc3RvcC1vcGFjaXR5PSIwIgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wMTQiIC8+CiAgICA8L3JhZGlhbEdyYWRpZW50PgogIDwvZGVmcz4KICA8cGF0aAogICAgIGQ9Im0gMzM5Ljk0MjU2LDU2OS4xNDA1OCAxNi42ODQsLTM5LjA5NSAtMC4xNTQzNSwtNTYuNDI2IDI5LjM3NCwtMTEuMjQ5IC04Ni4zNDIsLTU4LjM3OCAtMS40NjU3LC01MC40NDggLTMyLjcyOSwtMi4wMTkyIDIuMDY5Miw3MS4yMjEgMzQuOTg5LDI4LjY4NCAtNS4yMDIyLDI1LjM5NyAtNDAuNzI3LDI5LjM5OSAtOS4wNSw0Ni4yOTkgNTIuNDA2LDE0LjgxMyAzLjExODQsNS4xMDcgNi4yMDYzLDExMS4zOSAyOC41OTUsLTEuMDc4OCB6IgogICAgIGlkPSJwYXRoMTYiCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICBzdHlsZT0iZmlsbDojNGQ0ZDRkO2ZpbGwtcnVsZTpldmVub2RkO3N0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoxLjgzMzE5OTk4IiAvPgogIDxwYXRoCiAgICAgZD0ibSA0NDguNjQyNTYsNjgxLjI2MDU4IC05LjcxMjcsLTEyOS44NSAtMi4wNDQyLC0xOS4yNDYgLTI2Ljc1MSwtMC43MDc4MiAtNC4xMTM0LC05MC40NjcgLTg1Ljk1NSwtNDUuMDI0IC0yLjU2MTUsLTM3LjA1MSAxNzIuMDMsLTcuOTY4MiAtMi4yMDk3LDc3LjI4NiAtMjAuMDQsMjUuODI4IDUxLjEyLDcyLjc2NiAwLjczMjg1LDI1LjIyNCAtMzguNDA2LDcuMDU1OSAtMC45NzU0NywxMTkuNzcgeiIKICAgICBpZD0icGF0aDE4IgogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgc3R5bGU9ImZpbGw6IzRkNGQ0ZDtmaWxsLXJ1bGU6ZXZlbm9kZDtzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MS44MzMxOTk5OCIgLz4KICA8cGF0aAogICAgIGQ9Im0gNTQyLjM3MjU2LDU4Mi45NDA1OCBjIDAsMCAtOTIuNDE5LDQyLjc4MSAtMzM2Ljg4LDExLjI3MiAtMy4zOTg2LC0xNC43NTIgLTEuOTY5NiwtNjUuMzg5IC0xLjk2OTYsLTY1LjM4OSBsIDIyLjA0OCwtNy44MjA4IGMgMCwwIC0yLjcwMzUsLTMwNC4xNiAxLjI5NzgsLTMyOS44MiAtMy42MzMxLC0zMi44NiA2MC42MjIsLTExMC45MDAwMDEgMTMxLjg4LC0xMTIuMjQwMDAxIDk0Ljk2NCwtMS43ODAxIDE0Mi40Niw4Ny4zODIwMDEgMTQwLjc5LDkyLjQzNjAwMSAxMC44OTIsMjguNDQ5IDIyLjIzOSwzNDQuNjcgMjIuMjM5LDM0NC42NyBsIDE5LjA0Miw1LjIxMTkgMS41NTE3LDYxLjY3MSB6IgogICAgIGlkPSJwYXRoMjAiCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICBzdHlsZT0ib3BhY2l0eTowLjc4OTY4MDAzO2ZpbGw6I2ZmMDAwMDtzdHJva2U6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MS44MzMxOTk5OCIgLz4KICA8cGF0aAogICAgIGQ9Im0gNTQwLjI2MjU2LDU4MS43NzA1OCBjIDAsMCAtOTAuNjk0LDQyLjQxMyAtMzMwLjY0LDExLjA3OSAtMy4zNDAyLC0xNC42MzYgLTEuOTUzMywtNjQuODcxIC0xLjk1MzMsLTY0Ljg3MSBsIDIxLjYzNywtNy43NTIgYyAwLDAgLTIuNzQ3MSwtMzAxLjc1IDEuMTcyMiwtMzI3LjIgLTMuNTc2LC0zMi42MDEgNTkuNDY2LC0xMTAuMDEwMDAxIDEyOS40LC0xMTEuMzEwMDAxIDkzLjIwNSwtMS43MzY3IDEzOS44NSw4Ni43MzQwMDEgMTM4LjIxLDkxLjc0NzAwMSAxMC43LDI4LjIyNyAyMS45MzQsMzQxLjk1IDIxLjkzNCwzNDEuOTUgbCAxOC42OTEsNS4xNzY1IDEuNTQyLDYxLjE4MyB6IgogICAgIGlkPSJwYXRoMjIiCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICBzdHlsZT0iZmlsbDp1cmwoI2IpIiAvPgogIDxwYXRoCiAgICAgZD0ibSAyMjMuNjEyNTYsNTI2LjIyMDU4IGMgMCwtMmUtNSAtNi4wNzM3LDAuODM2MyAtOC44NDc0LDEuODEzOCBsIC04LjgzMzcsMy4xMTMgYyAtNGUtNSwyZS01IDE2NS40NCwyNC4zMjggMzM1LjI5LC03LjMzNzEgbCAtMi42Njk1LC0wLjkwMDM3IGMgLTMuMDU3NSwtMS4wMzEyIC05Ljk3MSwtMi43MjE0IC0xMi4wOTYsLTMuNDQ4MiBsIC0zMDIuODUsNi43NTkgeiIKICAgICBpZD0icGF0aDI0IgogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgc3R5bGU9Im9wYWNpdHk6MC41OTUyMzk5ODtmaWxsOiNjY2NjY2M7ZmlsbC1vcGFjaXR5OjAuNjIyNDEwMDI7ZmlsbC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlOiNjY2NjY2M7c3Ryb2tlLXdpZHRoOjEuODMzMTk5OTg7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kIiAvPgogIDxwYXRoCiAgICAgZD0iTSA2ODQuNjE1NzEsMjkxLjM5NTIyIEEgMjk0LjcxNTA4LDM0Mi4zNzQ2NCA4OC4zMzYxNDEgMSAxIDAuMTY5NTQ4NjksMzExLjI4MDA0IDI5NC43MTUwOCwzNDIuMzc0NjQgODguMzM2MTQxIDEgMSA2ODQuNjE1NzEsMjkxLjM5NTIyIFoiCiAgICAgaWQ9InBhdGgyNiIKICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICAgIHN0eWxlPSJvcGFjaXR5OjAuNTk1MjM5OTg7ZmlsbDp1cmwoI2EpIiAvPgo8L3N2Zz4K'

/**
 * Class for the Raspberry Pi GPIO blocks in Scratch 3.0
 * @constructor
 */
class Scratch3PiVSGPIOBlocks {
    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME () {
        return 'Raspberry Pi Simple Electronics';
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID () {
        return 'pivsgpio';
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
            id: Scratch3PiVSGPIOBlocks.EXTENSION_ID,
            name: Scratch3PiVSGPIOBlocks.EXTENSION_NAME,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'when_gpio',
                    text: formatMessage({
                        id: 'pivsgpio.when_gpio',
                        default: 'when button [GPIO] is [HILO]',
                        description: 'when the button is in the specified state'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        GPIO: {
                            type: ArgumentType.STRING,
                            menu: 'gpios',
                            defaultValue: '0'
                        },
                        HILO: {
                            type: ArgumentType.STRING,
                            menu: 'pressed',
                            defaultValue: 'pressed'
                        }
                    }
                },
                {
                    opcode: 'get_gpio',
                    text: formatMessage({
                        id: 'pivsgpio.get_gpio',
                        default: 'button [GPIO] is [HILO] ?',
                        description: 'is the button in the specified state?'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        GPIO: {
                            type: ArgumentType.STRING,
                            menu: 'gpios',
                            defaultValue: '0'
                        },
                        HILO: {
                            type: ArgumentType.STRING,
                            menu: 'pressed',
                            defaultValue: 'pressed'
                        }
                    }
                },
                { 
                    opcode: 'set_gpio',
                    text: formatMessage({
                        id: 'pivsgpio.set_gpio',
                        default: 'turn LED [GPIO] [HILO]',
                        description: 'set the LED to the specified state'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        GPIO: {
                            type: ArgumentType.STRING,
                            menu: 'gpios',
                            defaultValue: '0'
                        },
                        HILO: {
                            type: ArgumentType.STRING,
                            menu: 'onoff',
                            defaultValue: 'on'
                        }
                    }
                },
                { 
                    opcode: 'toggle_gpio',
                    text: formatMessage({
                        id: 'pivsgpio.toggle_gpio',
                        default: 'toggle LED [GPIO]',
                        description: 'change the state of the LED'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        GPIO: {
                            type: ArgumentType.STRING,
                            menu: 'gpios',
                            defaultValue: '0'
                        }
                    }
                },
            ],
            menus: {
                gpios: {
                    acceptReporters: true,
                    items: ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27']
                },
                pressed: ['pressed', 'released'],
                onoff: ['on', 'off'],
            }
        };
    }

    when_gpio (args)
    {
        const pin = Cast.toString (args.GPIO);
        const val = Cast.toString (args.HILO);

        let command = 'raspi-gpio set ' + pin + ' ip pu';
        cp.execSync (command);

        command = 'raspi-gpio get ' + pin
        const result = cp.execSync (command).toString();
        const elements = result.split (' ');

        if (elements[2].includes ('1'))
        {
            if (val == 'released') return true;
            else return false;
        }
        else
        {
            if (val == 'pressed') return true;
            else return false;
        }
    }

    get_gpio (args)
    {
        const pin = Cast.toString (args.GPIO);
        const val = Cast.toString (args.HILO);

        let command = 'raspi-gpio set ' + pin + ' ip pu';
        cp.execSync (command);

        command = 'raspi-gpio get ' + pin
        const result = cp.execSync (command).toString();
        const elements = result.split (' ');

        if (elements[2].includes ('1'))
        {
            if (val == 'released') return true;
            else return false;
        }
        else
        {
            if (val == 'pressed') return true;
            else return false;
        }
    }

    set_gpio (args)
    {
        const pin = Cast.toString (args.GPIO);
        const val = Cast.toString (args.HILO);

        let op = 'dh';
        if (val == 'off') op = 'dl';

        const command = 'raspi-gpio set ' + pin + ' op pn ' + op;
        cp.execSync (command);
    }

    toggle_gpio (args)
    {
        const pin = Cast.toString (args.GPIO);

        let command = 'raspi-gpio get ' + pin
        const result = cp.execSync (command).toString();
        const elements = result.split (' ');

        let op = 'dh';
        if (elements[2].includes ('1')) op = 'dl'
        command = 'raspi-gpio set ' + pin + ' op pn ' + op;
        cp.execSync (command);
    }

}

module.exports = Scratch3PiVSGPIOBlocks;
