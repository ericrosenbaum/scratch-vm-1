const formatMessage = require('format-message');
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const fs = window.require('fs');
var nodeimu = require("nodeimu");

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmVyc2lvbj0iMS4xIgogICB3aWR0aD0iODAwIgogICBoZWlnaHQ9IjgwMCIKICAgaWQ9InN2ZzM0MTAiCiAgIGlua3NjYXBlOnZlcnNpb249IjAuOTEgcjEzNzI1IgogICBzb2RpcG9kaTpkb2NuYW1lPSJyYXNwYmVycnktcGktbG9nb20uc3ZnIj4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGEzNDQ0Ij4KICAgIDxyZGY6UkRGPgogICAgICA8Y2M6V29yawogICAgICAgICByZGY6YWJvdXQ9IiI+CiAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CiAgICAgICAgPGRjOnR5cGUKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPgogICAgICAgIDxkYzp0aXRsZT48L2RjOnRpdGxlPgogICAgICA8L2NjOldvcms+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KICA8ZGVmcwogICAgIGlkPSJkZWZzMzQ0MiIgLz4KICA8c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIgogICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IgogICAgIGJvcmRlcm9wYWNpdHk9IjEiCiAgICAgb2JqZWN0dG9sZXJhbmNlPSIxMCIKICAgICBncmlkdG9sZXJhbmNlPSIxMCIKICAgICBndWlkZXRvbGVyYW5jZT0iMTAiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiCiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjEzODEiCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iOTY1IgogICAgIGlkPSJuYW1lZHZpZXczNDQwIgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICBmaXQtbWFyZ2luLWxlZnQ9Ijc1IgogICAgIGZpdC1tYXJnaW4tcmlnaHQ9Ijc1IgogICAgIGlua3NjYXBlOnpvb209IjAuNzg4NjIwNDgiCiAgICAgaW5rc2NhcGU6Y3g9IjMyMC44NjU1IgogICAgIGlua3NjYXBlOmN5PSIzNjAiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjQxMCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIwIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzM0MTAiIC8+CiAgPHBhdGgKICAgICBkPSJtIDI2Ny40MjYxOSw0My42MTUxMzggYyAtMy42MTkzLDAuMTEyMzE5IC03LjUxNzE1LDEuNDQ5MzI3IC0xMS45Mzc1LDQuOTM3NSAtMTAuODI2OTYsLTQuMTc2MyAtMjEuMzI3MDksLTUuNjI3MTg5IC0zMC43MTg3NSwyLjg3NSAtMTQuNDkzODYsLTEuODgwNzU4IC0xOS4yMTAyOSwyLjAwMDc0NCAtMjIuNzgxMjUsNi41MzEyNSAtMy4xODI1NSwtMC4wNjU4NyAtMjMuODE4ODUsLTMuMjcyMDcgLTMzLjI4MTI1LDEwLjg0Mzc1IC0yMy43ODE2NSwtMi44MTM0MiAtMzEuMjk2NzgsMTMuOTg3ODggLTIyLjc4MTI1LDI5LjY1NjI1IC00Ljg1NjkxLDcuNTE4OTUyIC05Ljg4OTUxLDE0Ljk0NzIzMiAxLjQ2ODc1LDI5LjI4MTI1MiAtNC4wMTgwMSw3Ljk4MzUxIC0xLjUyNzQzLDE2LjY0NDAzIDcuOTM3NSwyNy4xMjUgLTIuNDk3ODYsMTEuMjIyNiAyLjQxMjA3LDE5LjE0MDg2IDExLjIxODc1LDI1LjMxMjUgLTEuNjQ3MDksMTUuMzU3NTYgMTQuMDgzNSwyNC4yODc0MyAxOC43ODEyNSwyNy40Njg3NSAxLjgwMzY3LDguOTQ4NjggNS41NjI5MSwxNy4zOTI3IDIzLjUzMTI1LDIyLjA2MjUgMi45NjMyMywxMy4zMzYxIDEzLjc2MjA2LDE1LjYzOTA2IDI0LjIxODc1LDE4LjQzNzUgLTM0LjU2MTkzLDIwLjA4OTU0IC02NC4yMDA2Nyw0Ni41MjI2NiAtNjQsMTExLjM3NSBsIC01LjA2MjUsOS4wMzEyNSBjIC0zOS42MzA4NywyNC4xMDIyOSAtNzUuMjg1Mjk5LDEwMS41NjYyNiAtMTkuNTMxMjUsMTY0LjUzMTI1IDMuNjQxODcsMTkuNzA4MzggOS43NDk1OSwzMy44NjM5NiAxNS4xODc1LDQ5LjUzMTI1IDguMTMzODMsNjMuMTMwNTggNjEuMjE3NjMsOTIuNjkxNjEgNzUuMjE4NzUsOTYuMTg3NSAyMC41MTY1MywxNS42MjgxMiA0Mi4zNjgxOCwzMC40NTY3MiA3MS45Mzc1LDQwLjg0Mzc1IDI3Ljg3NTE1LDI4Ljc0OTQ2IDU4LjA3Mzg4LDM5LjcwNjQgODguNDM3NSwzOS42ODc1IDAuNDQ1MTUsLTIuOGUtNCAwLjg5ODUzLDAuMDA1IDEuMzQzNzUsMCAzMC4zNjM2MywwLjAxODkgNjAuNTYyMzUsLTEwLjkzODA0IDg4LjQzNzUsLTM5LjY4NzUgMjkuNTY5MzIsLTEwLjM4NzAzIDUxLjQyMDk3LC0yNS4yMTU2MyA3MS45Mzc1LC00MC44NDM3NSAxNC4wMDExMiwtMy40OTU4OSA2Ny4wODQ5MiwtMzMuMDU2OTIgNzUuMjE4NzUsLTk2LjE4NzUgNS40Mzc5MSwtMTUuNjY3MjkgMTEuNTQ1NjIsLTI5LjgyMjg3IDE1LjE4NzUsLTQ5LjUzMTI1IDU1Ljc1NDA0LC02Mi45NjQ5OSAyMC4wOTk2MSwtMTQwLjQyODk2IC0xOS41MzEyNSwtMTY0LjUzMTI1IGwgLTUuMDYyNSwtOS4wMzEyNSBjIDAuMjAwNjcsLTY0Ljg1MjM0IC0yOS40MzgwNywtOTEuMjg1NDYgLTY0LC0xMTEuMzc1IDEwLjQ1NjY5LC0yLjc5ODQ0IDIxLjI1NTUyLC01LjEwMTQgMjQuMjE4NzUsLTE4LjQzNzUgMTcuOTY4MzQsLTQuNjY5OCAyMS43Mjc1OCwtMTMuMTEzODIgMjMuNTMxMjUsLTIyLjA2MjUgNC42OTc3NSwtMy4xODEzMiAyMC40MjgzNCwtMTIuMTExMTkgMTguNzgxMjUsLTI3LjQ2ODc1IDguODA2NjgsLTYuMTcxNjQgMTMuNzE2NjEsLTE0LjA4OTkgMTEuMjE4NzUsLTI1LjMxMjUgOS40NjQ5NCwtMTAuNDgwOTcgMTEuOTU1NSwtMTkuMTQxNDkgNy45Mzc1LC0yNy4xMjUgMTEuMzU4MjUsLTE0LjMzNDAyIDYuMzI1NjYsLTIxLjc2MjMgMS40Njg3NSwtMjkuMjgxMjUyIDguNTE1NTMsLTE1LjY2ODM3IDEuMDAwNCwtMzIuNDY5NjcgLTIyLjc4MTI1LC0yOS42NTYyNSAtOS40NjI0LC0xNC4xMTU4MiAtMzAuMDk4NywtMTAuOTA5NjE1IC0zMy4yODEyNSwtMTAuODQzNzUgLTMuNTcwOTYsLTQuNTMwNTA2IC04LjI4NzM5LC04LjQxMjAwOCAtMjIuNzgxMjUsLTYuNTMxMjUgLTkuMzkxNjYsLTguNTAyMTg5IC0xOS44OTE3OSwtNy4wNTEzIC0zMC43MTg3NSwtMi44NzUgLTEyLjg1OTIsLTEwLjE0NzQxMyAtMjEuMzcyMjYsLTIuMDEzMjk2IC0zMS4wOTM3NSwxLjA2MjUgLTE1LjU3Mzg1LC01LjA4Nzc3OCAtMTkuMTMzMDIsMS44ODA5MDggLTI2Ljc4MTI1LDQuNzE4NzUgLTE2Ljk3NTI1LC0zLjU4ODA3NiAtMjIuMTM1Niw0LjIyMzUzMiAtMzAuMjgxMjUsMTIuNDY4NzUgbCAtOS40Njg3NSwtMC4xODc1IGMgLTI1LjYxMDU0LDE1LjA5MzExIC0zOC4zMzM3OCw0NS44MjU1MDIgLTQyLjg0Mzc1LDYxLjYyNTAwMiAtNC41MTIwNiwtMTUuODAxOTggLTE3LjIwNjQ3LC00Ni41MzQ1NDIgLTQyLjgxMjUsLTYxLjYyNTAwMiBsIC05LjQ2ODc1LDAuMTg3NSBjIC04LjE0NTY1LC04LjI0NTIxOCAtMTMuMzA2LC0xNi4wNTY4MjcgLTMwLjI4MTI1LC0xMi40Njg3NSAtNy42NDgyMywtMi44Mzc4NDIgLTExLjIwNzQsLTkuODA2NTI3IC0yNi43ODEyNSwtNC43MTg3NSAtNi4zNzk3MywtMi4wMTg0OTEgLTEyLjI0NjY3LC02LjIxNDQyOCAtMTkuMTU2MjUsLTYgeiIKICAgICBzdHlsZT0iZmlsbDojMDAwMDAwIgogICAgIGlkPSJwYXRoMzQxMiIKICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPgogIDxwYXRoCiAgICAgZD0ibSAyMTYuNDQzMDMsMTEwLjAxNDQ3IGMgNjcuOTQ3NjcsMzUuMDMxMzYgMTA3LjQ0Njg5LDYzLjM2ODk3IDEyOS4wODcxNyw4Ny41MDQ0NyAtMTEuMDgyMzUsNDQuNDE3NTkgLTY4Ljg5NjM4LDQ2LjQ0NDY0IC05MC4wMzU1OSw0NS4xOTg1OCA0LjMyODQyLC0yLjAxNDc0IDcuOTM5ODgsLTQuNDI3NzggOS4yMjA1MSwtOC4xMzU3NCAtNS4zMDQ0OSwtMy43Njk4MSAtMjQuMTEyODksLTAuMzk3MTkgLTM3LjI0MzYzLC03Ljc3NDE2IDUuMDQ0MDcsLTEuMDQ0OTkgNy40MDM0OCwtMi4wNjMwMiA5Ljc2Mjg5LC01Ljc4NTQyIC0xMi40MDU3MSwtMy45NTY3IC0yNS43Njg2MiwtNy4zNjY0MiAtMzMuNjI3NzUsLTEzLjkyMTE2IDQuMjQxMjUsMC4wNTI0IDguMjAxMTYsMC45NDg4IDEzLjc0MDM3LC0yLjg5MjcxIC0xMS4xMTE3LC01Ljk4ODE5IC0yMi45NjkxMSwtMTAuNzMzNTEgLTMyLjE4MTM5LC0xOS44ODczOCA1Ljc0NTIxLC0wLjE0MDYzIDExLjkzOTQ1LC0wLjA1NjggMTMuNzQwMzcsLTIuMTY5NTMgLTEwLjE3MDQ0LC02LjMwMDY4IC0xOC43NTEyNCwtMTMuMzA3ODcgLTI1Ljg1MzU5LC0yMC45NzIxNSA4LjAzOTk4LDAuOTcwNTIgMTEuNDM1MjgsMC4xMzQ3OCAxMy4zNzg3OCwtMS4yNjU1NiAtNy42ODc4LC03Ljg3NDE5IC0xNy40MTc1NiwtMTQuNTIzMTkgLTIyLjA1NjkxLC0yNC4yMjY0NCA1Ljk2OTYsMi4wNTc0OCAxMS40MzEyNSwyLjg0NTA2IDE1LjM2NzUyLC0wLjE4MDc5IC0yLjYxMjM3LC01Ljg5MzQ2IC0xMy44MDU0MiwtOS4zNjk2MiAtMjAuMjQ4OTcsLTIzLjE0MTY4IDYuMjg0MzYsMC42MDkzOCAxMi45NDk2MSwxLjM3MTExIDE0LjI4Mjc1LDAgLTIuOTIyMywtMTEuODg4NTYgLTcuOTI3NDUsLTE4LjU3MDAzMiAtMTIuODM2MzksLTI1LjQ5MjAwMiAxMy40NTAwNCwtMC4xOTk3MyAzMy44Mjc3NSwwLjA1MjMgMzIuOTA0NTcsLTEuMDg0NzcgbCAtOC4zMTY1NCwtOC40OTczMyBjIDEzLjEzNzYxLC0zLjUzNzI1IDI2LjU4MDY1LDAuNTY4MTYgMzYuMzM5NjYsMy42MTU4OCA0LjM4MTg2LC0zLjQ1NzY4IC0wLjA3NzYsLTcuODI5OTggLTUuNDIzODMsLTEyLjI5NDAxIDExLjE2NDk2LDEuNDkwNjQgMjEuMjUzODIsNC4wNTczOSAzMC4zNzM0NSw3LjU5MzM2IDQuODcyMzgsLTQuMzk5MzMgLTMuMTYzODksLTguNzk4NjYgLTcuMDUwOTgsLTEzLjE5Nzk5IDE3LjI0OTM2LDMuMjcyNTcgMjQuNTU3MTYsNy44NzA2OCAzMS44MTk4MSwxMi40NzQ4MSA1LjI2OTM1LC01LjA1MDggMC4zMDE2NiwtOS4zNDMzIC0zLjI1NDMsLTEzLjc0MDM2OSAxMy4wMDU2Niw0LjgxNzA0OSAxOS43MDQ3OCwxMS4wMzU1NDkgMjYuNzU3NTYsMTcuMTc1NDU5IDIuMzkxMTksLTMuMjI3MDUgNi4wNzQ5NCwtNS41OTI0IDEuNjI3MTUsLTEzLjM3ODc4IDkuMjM0MTYsNS4zMjI3MyAxNi4xODkyNiwxMS41OTUwNiAyMS4zMzM3NCwxOC42MjE4MiA1LjcxMzM2LC0zLjYzNzk0IDMuNDAzODcsLTguNjEzMDIgMy40MzUwOSwtMTMuMTk3OTkgOS41OTY2NSw3LjgwNjUyIDE1LjY4Njg3LDE2LjExMzk1IDIzLjE0MTY4LDI0LjIyNjQ1IDEuNTAxNjksLTEuMDkzNDQgMi44MTY2MSwtNC44MDE3MSAzLjk3NzQ3LC0xMC42NjY4NyAyMi44OTUzOSwyMi4yMTE4MTIgNTUuMjQ1OTEsNzguMTU4MjQyIDguMzE2NTQsMTAwLjM0MDg2MiAtMzkuOTE4NzcsLTMyLjk0NzE2IC04Ny42MTYxMywtNTYuODg3NTMgLTE0MC40NzcyMSwtNzQuODQ4ODYgeiIKICAgICBzdHlsZT0iZmlsbDojNzVhOTI4IgogICAgIGlkPSJwYXRoMzQxNCIKICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPgogIDxwYXRoCiAgICAgZD0ibSA1NzYuOTc2MDYsMTEwLjAxNDQ3IGMgLTY3Ljk0NzY3LDM1LjAzMTM2IC0xMDcuNDQ2ODksNjMuMzY4OTcgLTEyOS4wODcxNyw4Ny41MDQ0NyAxMS4wODIzNSw0NC40MTc1OSA2OC44OTYzOCw0Ni40NDQ2NCA5MC4wMzU1OSw0NS4xOTg1OCAtNC4zMjg0MiwtMi4wMTQ3NCAtNy45Mzk4OCwtNC40Mjc3OCAtOS4yMjA1MSwtOC4xMzU3NCA1LjMwNDQ5LC0zLjc2OTgxIDI0LjExMjg5LC0wLjM5NzE5IDM3LjI0MzYzLC03Ljc3NDE2IC01LjA0NDA3LC0xLjA0NDk5IC03LjQwMzQ4LC0yLjA2MzAyIC05Ljc2Mjg5LC01Ljc4NTQyIDEyLjQwNTcxLC0zLjk1NjcgMjUuNzY4NjIsLTcuMzY2NDIgMzMuNjI3NzUsLTEzLjkyMTE2IC00LjI0MTI2LDAuMDUyNCAtOC4yMDExNiwwLjk0ODggLTEzLjc0MDM3LC0yLjg5MjcxIDExLjExMTY5LC01Ljk4ODE5IDIyLjk2OTExLC0xMC43MzM1MSAzMi4xODEzOSwtMTkuODg3MzggLTUuNzQ1MjEsLTAuMTQwNjMgLTExLjkzOTQ1LC0wLjA1NjggLTEzLjc0MDM3LC0yLjE2OTUzIDEwLjE3MDQ0LC02LjMwMDY4IDE4Ljc1MTI0LC0xMy4zMDc4NyAyNS44NTM1OSwtMjAuOTcyMTUgLTguMDM5OTgsMC45NzA1MiAtMTEuNDM1MjgsMC4xMzQ3OCAtMTMuMzc4NzgsLTEuMjY1NTYgNy42ODc3OSwtNy44NzQxOSAxNy40MTc1NiwtMTQuNTIzMTkgMjIuMDU2OTEsLTI0LjIyNjQ0IC01Ljk2OTYxLDIuMDU3NDggLTExLjQzMTI1LDIuODQ1MDYgLTE1LjM2NzUyLC0wLjE4MDc5IDIuNjEyMzcsLTUuODkzNDYgMTMuODA1NDEsLTkuMzY5NjIgMjAuMjQ4OTcsLTIzLjE0MTY4IC02LjI4NDM2LDAuNjA5MzggLTEyLjk0OTYxLDEuMzcxMTEgLTE0LjI4Mjc2LDAgMi45MjIzMSwtMTEuODg4NTYgNy45Mjc0NiwtMTguNTcwMDIyIDEyLjgzNjQsLTI1LjQ5MjAwMiAtMTMuNDUwMDQsLTAuMTk5NzMgLTMzLjgyNzc1LDAuMDUyNCAtMzIuOTA0NTcsLTEuMDg0NzcgbCA4LjMxNjU0LC04LjQ5NzMzIGMgLTEzLjEzNzYyLC0zLjUzNzI1IC0yNi41ODA2NSwwLjU2ODE2IC0zNi4zMzk2NiwzLjYxNTg4IC00LjM4MTg2LC0zLjQ1NzY4IDAuMDc3NiwtNy44Mjk5OCA1LjQyMzgzLC0xMi4yOTQwMSAtMTEuMTY0OTYsMS40OTA2NCAtMjEuMjUzODIsNC4wNTczOSAtMzAuMzczNDUsNy41OTMzNiAtNC44NzIzOCwtNC4zOTkzMyAzLjE2Mzg5LC04Ljc5ODY2IDcuMDUwOTgsLTEzLjE5Nzk5IC0xNy4yNDkzNiwzLjI3MjU3IC0yNC41NTcxNiw3Ljg3MDY4IC0zMS44MTk4MSwxMi40NzQ4MSAtNS4yNjkzNSwtNS4wNTA4IC0wLjMwMTY2LC05LjM0MzMgMy4yNTQzLC0xMy43NDAzNjkgLTEzLjAwNTY2LDQuODE3MDQ5IC0xOS43MDQ3OCwxMS4wMzU1NDkgLTI2Ljc1NzU2LDE3LjE3NTQ1OSAtMi4zOTExOSwtMy4yMjcwNSAtNi4wNzQ5NCwtNS41OTI0IC0xLjYyNzE1LC0xMy4zNzg3OCAtOS4yMzQxNiw1LjMyMjczIC0xNi4xODkyNiwxMS41OTUwNiAtMjEuMzMzNzQsMTguNjIxODIgLTUuNzEzMzYsLTMuNjM3OTQgLTMuNDAzODcsLTguNjEzMDIgLTMuNDM1MDksLTEzLjE5Nzk5IC05LjU5NjY1LDcuODA2NTIgLTE1LjY4Njg3LDE2LjExMzk1IC0yMy4xNDE2OCwyNC4yMjY0NSAtMS41MDE2OSwtMS4wOTM0NCAtMi44MTY2MSwtNC44MDE3MSAtMy45Nzc0NywtMTAuNjY2ODcgLTIyLjg5NTM5LDIyLjIxMTgxMiAtNTUuMjQ1OTEsNzguMTU4MjQyIC04LjMxNjU0LDEwMC4zNDA4NjIgMzkuOTE4NzcsLTMyLjk0NzE2IDg3LjYxNjEzLC01Ni44ODc1MyAxNDAuNDc3MjEsLTc0Ljg0ODg2IHoiCiAgICAgc3R5bGU9ImZpbGw6Izc1YTkyOCIKICAgICBpZD0icGF0aDM0MTYiCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz4KICA8cGF0aAogICAgIGQ9Im0gNDc4Ljk5NzUzLDU2Mi4zMTk5MyBhIDgxLjM5MDExMSw3NS4wNTE3NjIgMCAwIDEgLTE2Mi43ODAyMiwwIDgxLjM5MDExMSw3NS4wNTE3NjIgMCAxIDEgMTYyLjc4MDIyLDAgeiIKICAgICBzdHlsZT0iZmlsbDojYmMxMTQyIgogICAgIGlkPSJwYXRoMzQxOCIKICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPgogIDxwYXRoCiAgICAgZD0iTSAzNTAuNTA1MjEsMzQ3LjkyMTMxIEEgNzIuOTk4ODM5LDg2LjEyOTY3NCAzNC4wMzQyMjYgMCAxIDI1NS41MzczNyw0OTEuNjMzNTcgNzIuOTk4ODM5LDg2LjEyOTY3NCAzNC4wMzQyMjYgMSAxIDM1MC41MDUyMSwzNDcuOTIxMzEgWiIKICAgICBzdHlsZT0iZmlsbDojYmMxMTQyIgogICAgIGlkPSJwYXRoMzQyMCIKICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPgogIDxwYXRoCiAgICAgZD0iTSA0NDEuNTM3MzksMzQzLjkyMTMxIEEgODYuMTI5Njc0LDcyLjk5ODgzOSA1NS45NjU3NzQgMCAwIDUzNi41MDUyMyw0ODcuNjMzNTcgODYuMTI5Njc0LDcyLjk5ODgzOSA1NS45NjU3NzQgMSAwIDQ0MS41MzczOSwzNDMuOTIxMzEgWiIKICAgICBzdHlsZT0iZmlsbDojYmMxMTQyIgogICAgIGlkPSJwYXRoMzQyMiIKICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPgogIDxwYXRoCiAgICAgZD0ibSAxODEuOTYxNDQsMzg0LjA0NjY5IGMgMzYuNDE0MjIsLTkuNzU2OTIgMTIuMjkxNTksMTUwLjYzNjUxIC0xNy4zMzMzOCwxMzcuNDc1NzcgLTMyLjU4Njc3LC0yNi4yMTI2OCAtNDMuMDgzMDcsLTEwMi45NzU0MyAxNy4zMzMzOCwtMTM3LjQ3NTc3IHoiCiAgICAgc3R5bGU9ImZpbGw6I2JjMTE0MiIKICAgICBpZD0icGF0aDM0MjQiCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz4KICA8cGF0aAogICAgIGQ9Im0gNjAyLjcyOTQ3LDM4Mi4wNDY2OSBjIC0zNi40MTQyMiwtOS43NTY5MiAtMTIuMjkxNiwxNTAuNjM2NTEgMTcuMzMzMzgsMTM3LjQ3NTc3IDMyLjU4Njc3LC0yNi4yMTI2OCA0My4wODMwNywtMTAyLjk3NTQzIC0xNy4zMzMzOCwtMTM3LjQ3NTc3IHoiCiAgICAgc3R5bGU9ImZpbGw6I2JjMTE0MiIKICAgICBpZD0icGF0aDM0MjYiCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz4KICA8cGF0aAogICAgIGQ9Im0gNDc5LjAyMjc3LDI2Mi42MTIyOSBjIDYyLjgzNDg2LC0xMC42MTAxMyAxMTUuMTE1OTQsMjYuNzIyMjkgMTEzLjAxMTM4LDk0Ljg1Nzk2IC0yLjA2NjkzLDI2LjEyMTEyIC0xMzYuMTU4NzIsLTkwLjk2OTA3IC0xMTMuMDExMzgsLTk0Ljg1Nzk2IHoiCiAgICAgc3R5bGU9ImZpbGw6I2JjMTE0MiIKICAgICBpZD0icGF0aDM0MjgiCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz4KICA8cGF0aAogICAgIGQ9Im0gMzA1LjQxMDk0LDI2MC42MTIyOSBjIC02Mi44MzQ4NiwtMTAuNjEwMTMgLTExNS4xMTU5NCwyNi43MjIyOSAtMTEzLjAxMTM4LDk0Ljg1Nzk2IDIuMDY2OTMsMjYuMTIxMTIgMTM2LjE1ODcyLC05MC45NjkwNyAxMTMuMDExMzgsLTk0Ljg1Nzk2IHoiCiAgICAgc3R5bGU9ImZpbGw6I2JjMTE0MiIKICAgICBpZD0icGF0aDM0MzAiCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz4KICA8cGF0aAogICAgIGQ9Im0gMzk1LjY3MDUxLDI0NC43MTQ1NyBjIC0zNy41MDI1OSwtMC45NzU0OCAtNzMuNDk1NDgsMjcuODM0MTggLTczLjU4MTU4LDQ0LjU0NDQzIC0wLjEwNDYyLDIwLjMwNDI2IDI5LjY1MTIsNDEuMDkyNjYgNzMuODM3MjYsNDEuNjIwMzUgNDUuMTIzMDUsMC4zMjMyMSA3My45MTU2MSwtMTYuNjQwNDkgNzQuMDYxMSwtMzcuNTk0MDkgMC4xNjQ4NCwtMjMuNzM5OTYgLTQxLjAzODc5LC00OC45Mzc0NCAtNzQuMzE2NzgsLTQ4LjU3MDY5IHoiCiAgICAgc3R5bGU9ImZpbGw6I2JjMTE0MiIKICAgICBpZD0icGF0aDM0MzIiCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz4KICA8cGF0aAogICAgIGQ9Im0gMzk3Ljk2MDU2LDY2MS4wNzU2NCBjIDMyLjY5NzQ0LC0xLjQyNzExIDc2LjU3MDgzLDEwLjUzMTk2IDc2LjY1NjgsMjYuMzk1OTggMC41NDI3LDE1LjQwNTIgLTM5Ljc4OTY5LDUwLjIxMDU1IC03OC44MjYzNCw0OS41Mzc2NSAtNDAuNDI3MjksMS43NDM5MSAtODAuMDY5MDgsLTMzLjExNTU5IC03OS41NDk1MSwtNDUuMTk4NTkgLTAuNjA1MDYsLTE3LjcxNTkzIDQ5LjIyNiwtMzEuNTQ3OTYgODEuNzE5MDUsLTMwLjczNTA0IHoiCiAgICAgc3R5bGU9ImZpbGw6I2JjMTE0MiIKICAgICBpZD0icGF0aDM0MzQiCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz4KICA8cGF0aAogICAgIGQ9Im0gMjc3LjE4OTkzLDU2Ny4wNjI1OCBjIDIzLjI3OTEsMjguMDQ1NzMgMzMuODkwNjYsNzcuMzE4OTkgMTQuNDYzNTUsOTEuODQzNTMgLTE4LjM3OTE3LDExLjA4Nzg0IC02My4wMTIyOCw2LjUyMTYyIC05NC43MzYyNCwtMzkuMDUxNTcgLTIxLjM5NTA1LC0zOC4yNDE2OCAtMTguNjM3NTgsLTc3LjE1NjYzIC0zLjYxNTg5LC04OC41ODkyNCAyMi40NjQ0MywtMTMuNjg0MjkgNTcuMTczNDMsNC43OTkwMiA4My44ODg1OCwzNS43OTcyOCB6IgogICAgIHN0eWxlPSJmaWxsOiNiYzExNDIiCiAgICAgaWQ9InBhdGgzNDM2IgogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+CiAgPHBhdGgKICAgICBkPSJtIDUxNC4wNzIwOSw1NTguMTcwNjYgYyAtMjUuMTg2ODIsMjkuNTAxNjUgLTM5LjIxMjI3LDgzLjMwOTUxIC0yMC44Mzc4NSwxMDAuNjQyOCAxNy41NjgyOCwxMy40NjM2MSA2NC43MjkyLDExLjU4MTYyIDk5LjU2NTY2LC0zNi43NTU3NCAyNS4yOTU5OSwtMzIuNDY0NzEgMTYuODIwMTMsLTg2LjY4MjI1IDIuMzcwNzcsLTEwMS4wNzUxMSAtMjEuNDY0MDgsLTE2LjYwMjEzIC01Mi4yNzY5MSw0LjY0NDg5IC04MS4wOTg1OCwzNy4xODgwNSB6IgogICAgIHN0eWxlPSJmaWxsOiNiYzExNDIiCiAgICAgaWQ9InBhdGgzNDM4IgogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+Cjwvc3ZnPgo='

/**
 * Class for the makey makey blocks in Scratch 3.0
 * @constructor
 */
class Scratch3PiSenseHatBlocks {
    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME () {
        return 'Raspberry Pi Sense HAT';
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID () {
        return 'pisensehat';
    }
    
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        // global colours
        this._fg = [255, 255, 255];
        this._bg = [0, 0, 0];

        // global rotation
        this._orient = 0;

        // find the framebuffer on the SenseHAT
        this.fbfile = "";
        var fbtest = 0;
        while (1)
        {
            var fname = "/sys/class/graphics/fb" + fbtest.toString () + "/name";
            if (fs.existsSync (fname))
            {
                var data = fs.readFileSync (fname, 'utf8');
                if (data.indexOf ('RPi-Sense FB') != -1)
                {
                    this.fbfile = "/dev/fb" + fbtest.toString ();
                    nodeimu  = require('nodeimu');
                    this.IMU = new nodeimu.IMU();
                    break;
                }
            }
            else
            {
                // fall back to the emulator if possible
                if (fs.existsSync ("/dev/shm/rpi-sense-emu-screen"))
                {
                    this.fbfile = "/dev/shm/rpi-sense-emu-screen";
                    break;
                }
                else break;
            }
            fbtest++;
        }
    }


    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: Scratch3PiSenseHatBlocks.EXTENSION_ID,
            name: Scratch3PiSenseHatBlocks.EXTENSION_NAME,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'set_fg',
                    text: formatMessage({
                        id: 'pisensehat.set_fg',
                        default: 'set colour to [COLOUR]',
                        description: 'set foreground colour from colour picker'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        COLOUR: {
                            type: ArgumentType.COLOR
                        }
                    }
                },
                {
                    opcode: 'set_bg',
                    text: formatMessage({
                        id: 'pisensehat.set_bg',
                        default: 'set background to [COLOUR]',
                        description: 'set background colour from colour picker'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        COLOUR: {
                            type: ArgumentType.COLOR
                        }
                    }
                },
                {
                    opcode: 'set_pixel_new',
                    text: formatMessage({
                        id: 'pisensehat.set_pixel_new',
                        default: 'set pixel x [X] y [Y] to [COLOUR]',
                        description: 'set pixel from colour picker'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.STRING,
                            menu: 'coords',
                            defaultValue: '0'
                        },
                        Y: {
                            type: ArgumentType.STRING,
                            menu: 'coords',
                            defaultValue: '0'
                        },
                        COLOUR: {
                            type: ArgumentType.COLOR
                        }
                    }
                },
                {
                    opcode: 'set_orient',
                    text: formatMessage({
                        id: 'pisensehat.set_orient',
                        default: 'set rotation to [ROT] degrees',
                        description: 'set rotation of LED matrix'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ROT: {
                            type: ArgumentType.STRING,
                            menu: 'rots',
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: 'all_off',
                    text: formatMessage({
                        id: 'pisensehat.all_off',
                        default: 'clear display',
                        description: 'turn off all LEDs'
                    }),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'show_letter_glob',
                    text: formatMessage({
                        id: 'pisensehat.show_letter_glob',
                        default: 'display character [LETTER]',
                        description: 'show letter in foreground colour'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        LETTER: {
                            type: ArgumentType.STRING,
                            defaultValue: 'A'
                        },
                    }
                },
                {
                    opcode: 'scroll_message_glob',
                    text: formatMessage({
                        id: 'pisensehat.scroll_message_glob',
                        default: 'display text [MESSAGE]',
                        description: 'scroll message across in foreground colour'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        MESSAGE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello!'
                        }
                    }
                },
                '---',
                {
                    opcode: 'get_temp',
                    text: formatMessage({
                        id: 'pisensehat.get_temp',
                        default: 'temperature',
                        description: 'gets temperature'
                    }),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'get_press',
                    text: formatMessage({
                        id: 'pisensehat.get_press',
                        default: 'pressure',
                        description: 'gets pressure'
                    }),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'get_humid',
                    text: formatMessage({
                        id: 'pisensehat.get_humid',
                        default: 'humidity',
                        description: 'gets humidity'
                    }),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'get_ox',
                    text: formatMessage({
                        id: 'pisensehat.get_ox',
                        default: 'roll',
                        description: 'gets roll'
                    }),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'get_oy',
                    text: formatMessage({
                        id: 'pisensehat.get_oy',
                        default: 'pitch',
                        description: 'gets pitch'
                    }),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'get_oz',
                    text: formatMessage({
                        id: 'pisensehat.get_oz',
                        default: 'yaw',
                        description: 'gets yaw'
                    }),
                    blockType: BlockType.REPORTER
                },
                '---',
                {
                    opcode: 'set_pixel',
                    text: formatMessage({
                        id: 'pisensehat.set_pixel',
                        default: 'set pixel [X],[Y] to R [R] G [G] B [B]',
                        description: 'set pixel to RGB colour'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.STRING,
                            menu: 'coords',
                            defaultValue: '0'
                        },
                        Y: {
                            type: ArgumentType.STRING,
                            menu: 'coords',
                            defaultValue: '0'
                        },
                        R: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255
                        },
                        G: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255
                        },
                        B: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255
                        }
                    }
                },
                {
                    opcode: 'set_pixel_col',
                    text: formatMessage({
                        id: 'pisensehat.set_pixel_col',
                        default: 'set pixel [X],[Y] to [COLOUR]',
                        description: 'set pixel to named colour'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.STRING,
                            menu: 'coords',
                            defaultValue: '0'
                        },
                        Y: {
                            type: ArgumentType.STRING,
                            menu: 'coords',
                            defaultValue: '0'
                        },
                        COLOUR: {
                            type: ArgumentType.STRING,
                            menu: 'colours',
                            defaultValue: 'white'
                        }
                    }
                },
                {
                    opcode: 'set_all_pixels',
                    text: formatMessage({
                        id: 'pisensehat.set_all_pixels',
                        default: 'set all pixels to R [R] G [G] B [B]',
                        description: 'set all pixels to RGB colour'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        R: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255
                        },
                        G: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255
                        },
                        B: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255
                        }
                    }
                },
                {
                    opcode: 'set_all_pixels_col',
                    text: formatMessage({
                        id: 'pisensehat.set_all_pixels_col',
                        default: 'set all pixels to [COLOUR]',
                        description: 'set all pixels to named colour'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        COLOUR: {
                            type: ArgumentType.STRING,
                            menu: 'colours',
                            defaultValue: 'white'
                        }
                    }
                },
                {
                    opcode: 'show_letter',
                    text: formatMessage({
                        id: 'pisensehat.show_letter',
                        default: 'show letter [LETTER] at rotation [ROT] in [COLOUR] background [BCOLOUR]',
                        description: 'show letter at rotation in colour'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        LETTER: {
                            type: ArgumentType.STRING,
                            defaultValue: 'A'
                        },
                        ROT: {
                            type: ArgumentType.STRING,
                            menu: 'rots',
                            defaultValue: '0'
                        },
                        COLOUR: {
                            type: ArgumentType.STRING,
                            menu: 'colours',
                            defaultValue: 'white'
                        },
                        BCOLOUR: {
                            type: ArgumentType.STRING,
                            menu: 'colours',
                            defaultValue: 'off'
                        }
                    }
                },
                {
                    opcode: 'scroll_message',
                    text: formatMessage({
                        id: 'pisensehat.scroll_message',
                        default: 'scroll message [MESSAGE] at rotation [ROT] in [COLOUR] background [BCOLOUR]',
                        description: 'scroll message across at rotation in colour'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        MESSAGE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello!'
                        },
                        ROT: {
                            type: ArgumentType.STRING,
                            menu: 'rots',
                            defaultValue: '0'
                        },
                        COLOUR: {
                            type: ArgumentType.STRING,
                            menu: 'colours',
                            defaultValue: 'white'
                        },
                        BCOLOUR: {
                            type: ArgumentType.STRING,
                            menu: 'colours',
                            defaultValue: 'off'
                        }
                    }
                }
            ],
            menus: {
                colours: ['off', 'red', 'green', 'blue', 'yellow', 'cyan', 'magenta', 'white'],
                coords: ['0','1','2','3','4','5','6','7'],
                rots: ['0', '90', '180', '270']
            }
        };
    }

    get_temp ()
    {
        if (this.fbfile == "/dev/shm/rpi-sense-emu-screen")
        {
            var data = new Uint8Array (20);
            var fd = fs.openSync ("/dev/shm/rpi-sense-emu-pressure", "r");
            fs.readSync (fd, data, 0, 20, 0);
            fs.closeSync (fd);
            var view = new DataView (data.buffer, 0, 20);
            return Number((view.getInt16 (16, true) / 480) + 37).toFixed (2);
        }
        var data = this.IMU.getValueSync();
        return Number (data.temperature).toFixed (2);
    };

    get_press ()
    {
        if (this.fbfile == "/dev/shm/rpi-sense-emu-screen")
        {
            var data = new Uint8Array (20);
            var fd = fs.openSync ("/dev/shm/rpi-sense-emu-pressure", "r");
            fs.readSync (fd, data, 0, 20, 0);
            fs.closeSync (fd);
            var view = new DataView (data.buffer, 0, 20);
            return Number (view.getInt32 (12, true) / 4096).toFixed (2);
        }
        var data = this.IMU.getValueSync();
        return Number (data.pressure).toFixed (2);
    };

    get_humid ()
    {
        if (this.fbfile == "/dev/shm/rpi-sense-emu-screen")
        {
            var data = new Uint8Array (28);
            var fd = fs.openSync ("/dev/shm/rpi-sense-emu-humidity", "r");
            fs.readSync (fd, data, 0, 28, 0);
            fs.closeSync (fd);
            var view = new DataView (data.buffer, 0, 28);
            return Number (view.getInt16 (22, true) / 256).toFixed (2);
        }
        var data = this.IMU.getValueSync();
        return Number (data.humidity).toFixed (2);
    };

    get_ox ()
    {
        if (this.fbfile == "/dev/shm/rpi-sense-emu-screen")
        {
            var data = new Uint8Array (56);
            var fd = fs.openSync ("/dev/shm/rpi-sense-emu-imu", "r");
            fs.readSync (fd, data, 0, 56, 0);
            fs.closeSync (fd);
            var view = new DataView (data.buffer, 0, 56);
            return Number (view.getInt16 (50, true) * 360 / 32768).toFixed (2);
        }
        var data = this.IMU.getValueSync();
        return Number (data.fusionPose.x * 180 / Math.PI).toFixed (2);
    };

    get_oy ()
    {
        if (this.fbfile == "/dev/shm/rpi-sense-emu-screen")
        {
            var data = new Uint8Array (56);
            var fd = fs.openSync ("/dev/shm/rpi-sense-emu-imu", "r");
            fs.readSync (fd, data, 0, 56, 0);
            fs.closeSync (fd);
            var view = new DataView (data.buffer, 0, 56);
            return Number (view.getInt16 (52, true) * 360 / 32768).toFixed (2);
        }
        var data = this.IMU.getValueSync();
        return Number (data.fusionPose.y * 180 / Math.PI).toFixed (2);
    };

    get_oz ()
    {
        if (this.fbfile == "/dev/shm/rpi-sense-emu-screen")
        {
            var data = new Uint8Array (56);
            var fd = fs.openSync ("/dev/shm/rpi-sense-emu-imu", "r");
            fs.readSync (fd, data, 0, 56, 0);
            fs.closeSync (fd);
            var view = new DataView (data.buffer, 0, 56);
            return Number (view.getInt16 (54, true) * 360 / 32768).toFixed (2);
        }
        var data = this.IMU.getValueSync();
        return Number (data.fusionPose.z * 180 / Math.PI).toFixed (2);
    };

    _map_colour (col)
    {
        if (col == 'off') return 0;
        else if (col == 'white') return 0x1CE7;
        else if (col == 'red') return 0x00E0;
        else if (col == 'green') return 0x0007;
        else if (col == 'blue') return 0x1C00;
        else if (col == 'magenta') return 0x1CE0;
        else if (col == 'yellow') return 0x00E7;
        else if (col == 'cyan') return 0x1C07;
        return 0;
    }

    _pixel (x, y, val)
    {
        pix = new Uint8Array (2);
        pix[0] = val / 256;
        pix[1] = val % 256;
        pos = y * 8 + x;
        fd = fs.openSync (this.fbfile, "r+");
        fs.writeSync (fd, pix, 0, 2, pos * 2);
        fs.closeSync (fd);
    }

    _pixel_remap (x, y, val)
    {
        pix = new Uint8Array (2);
        pix[0] = val / 256;
        pix[1] = val % 256;
        if (this._orient == 90)
            pos = x * 8 + (7 - y);
        else if (this._orient == 180)
            pos = 63 - (y * 8 + x);
        else if (this._orient == 270)
            pos = (7 - x) * 8 + y;
        else
            pos = y * 8 + x;
        fd = fs.openSync (this.fbfile, "r+");
        fs.writeSync (fd, pix, 0, 2, pos * 2);
        fs.closeSync (fd);
    }

    set_pixel (args)
    {
        x = Cast.toNumber (args.X);
        y = Cast.toNumber (args.Y);

        r = Cast.toNumber (args.R);
        g = Cast.toNumber (args.G);
        b = Cast.toNumber (args.B);
        val = (Math.trunc (b / 32) * 1024) + (Math.trunc (r / 32) * 32) + Math.trunc (g / 32);

        this._pixel (x, y, val);
    }

    set_pixel_col (args)
    {
        x = Cast.toNumber (args.X);
        y = Cast.toNumber (args.Y);

        col = Cast.toString (args.COLOUR);
        val = this._map_colour (col);

        this._pixel (x, y, val);
    }

    set_pixel_new (args)
    {
        x = Cast.toNumber (args.X);
        y = Cast.toNumber (args.Y);

        color = Cast.toRgbColorList (args.COLOUR);
        val = (Math.trunc (color[2] / 32) * 1024) + (Math.trunc (color[0] / 32) * 32) + Math.trunc (color[1] / 32);

        this._pixel_remap (x, y, val);
    }

    _all_pixels (val)
    {
        pix = new Uint8Array (128);
        count = 0;
        while (count < 64)
        {
            pix[count * 2] = val / 256;
            pix[count * 2 + 1] = val % 256;
            count++;
        }
        fd = fs.openSync (this.fbfile, "r+");
        fs.writeSync (fd, pix, 0, 128, 0);
        fs.closeSync (fd);
    }

    all_off ()
    {
        this._all_pixels (0);
    }

    set_all_pixels (args)
    {
        r = Cast.toNumber (args.R);
        g = Cast.toNumber (args.G);
        b = Cast.toNumber (args.B);
        val = (Math.trunc (b / 32) * 1024) + (Math.trunc (r / 32) * 32) + Math.trunc (g / 32);

        this._all_pixels (val);
    }

    set_all_pixels_new (args)
    {
        color = Cast.toRgbColorList (args.COLOUR);
        val = (Math.trunc (color[2] / 32) * 1024) + (Math.trunc (color[0] / 32) * 32) + Math.trunc (color[1] / 32);

        this._all_pixels (val);
    }

    set_all_pixels_col (args)
    {
        col = Cast.toString(args.COLOUR);
        val = this._map_colour (col);

        this._all_pixels (val);
    }

    set_all_pixels_fg (args)
    {
        val = (Math.trunc (this._fg[2] / 32) * 1024) + (Math.trunc (this._fg[0] / 32) * 32) + Math.trunc (this._fg[1] / 32);

        this._all_pixels (val);
    }

    set_fg (args)
    {
        color = Cast.toRgbColorList(args.COLOUR);
        this._fg[0] = color[0];
        this._fg[1] = color[1];
        this._fg[2] = color[2];
    }

    set_bg (args)
    {
        color = Cast.toRgbColorList(args.COLOUR);
        this._bg[0] = color[0];
        this._bg[1] = color[1];
        this._bg[2] = color[2];
        val = (Math.trunc (this._bg[2] / 32) * 1024) + (Math.trunc (this._bg[0] / 32) * 32) + Math.trunc (this._bg[1] / 32);
        this._all_pixels (val)
    }

    set_orient (args)
    {
        orient = Cast.toNumber(args.ROT);
        this._orient = orient;
    }

    _map_orient (pos, orient)
    {
        if (orient == 0)
        {
            x = pos % 8;
            y = (pos - x) / 8;
            if (x > 4) return 40;
            else return ((x * 1) + 1) * 8 - 1 - (y * 1);
        }
        else if (orient == 90)
        {
            if (pos < 40) return pos;
            else return 40;
        }
        else if (orient == 180)
        {
            x = pos % 8;
            y = (pos - x) / 8;
            if (x < 3) return 40;
            else return (7 - (x * 1)) * 8 + (y * 1);
        }
        else if (orient == 270)
        {
            if (pos > 24) return 63 - pos;
            else return 40;
        }
        return 40;
    }

    _load_letter (lett)
    {
        const dict = " +-*/!\"#$><0123456789.=)(ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz?,;:|@%[&_']\\~"
        lgr = new Uint8Array (80);
        inv = 90 - dict.indexOf (lett);
        if (inv > 90) inv = 90;
        fd = fs.openSync ('/usr/lib/scratch3/sense_hat_text.bmp', 'r');
        for (count = 0; count < 5; count++)
            fs.readSync (fd, lgr, count * 16, 16, 3098 + inv * 80 + (64 - count * 16));
        fs.closeSync (fd);
        return lgr;
    }

    _letter (lett, orient, valf, valb)
    {
        pix = new Uint8Array (128);
        lgr = this._load_letter (lett);
        for (count = 0; count < 64; count++)
        {
            map = this._map_orient (count, orient);
            if (map == 40) val = valb;
            else if (lgr[map * 2] == 0xFF) val = valf;
            else val = valb;
            pix[count * 2] = val / 256;
            pix[count * 2 + 1] = val % 256;
        }
        fd = fs.openSync (this.fbfile, "r+");
        fs.writeSync (fd, pix, 0, 128, 0);
        fs.closeSync (fd);
    };

    show_letter_glob (args)
    {
        lett = Cast.toString(args.LETTER);
        valf = (Math.trunc (this._fg[2] / 32) * 1024) + (Math.trunc (this._fg[0] / 32) * 32) + Math.trunc (this._fg[1] / 32);
        valb = (Math.trunc (this._bg[2] / 32) * 1024) + (Math.trunc (this._bg[0] / 32) * 32) + Math.trunc (this._bg[1] / 32);

        if (lett.length != 1) return;
        this._letter (lett, this._orient, valf, valb);
    }

    show_letter (args)
    {
        lett = Cast.toString(args.LETTER);
        orient = Cast.toNumber(args.ROT);
        colour = Cast.toString(args.COLOUR);
        bg = Cast.toString(args.BCOLOUR);
        valf = this._map_colour (colour);
        valb = this._map_colour (bg);

        if (lett.length != 1) return;
        this._letter (lett, orient, valf, valb);
    }

    _message (message, orient, valf, valb)
    {
        pix = new Uint8Array (128);
        char_ind = 0;
        lett_ind = 0;
        //msg = String (message);
        pix0 = valf / 256;
        pix1 = valf % 256;
        bg0 = valb / 256;
        bg1 = valb % 256;

        // clear the grid to off and output
        for (pel = 0; pel < 64; pel++)
        {
            pix[pel*2] = bg0;
            pix[pel*2 + 1] = bg1;
        }
        fd = fs.openSync (this.fbfile, "r+");
        fs.writeSync (fd, pix, 0, 128, 0);
        fs.closeSync (fd);

        for (lett_ind = 0; lett_ind < message.length + 2; lett_ind++)
        {
            lgrid = this._load_letter (message[lett_ind]);
            for (char_ind = 0; char_ind < 6; char_ind++)
            {
                // scroll the grid
                for (col = 0; col < 7; col++)
                {
                    for (row = 0; row < 8; row++)
                    {
                        if (orient == 0)
                        {
                            // from right to left
                            pix[(row * 16) + (col * 2)] = pix[(row * 16) + (col + 1) * 2];
                            pix[(row * 16) + (col * 2) + 1] = pix[(row * 16) + (col + 1) * 2 + 1];
                        }
                        else if (orient == 90)
                        {
                            // from the bottom up
                            pix[(col * 16) + (row * 2)] = pix[((col + 1) * 16) + (row * 2)];
                            pix[(col * 16) + (row * 2) + 1] = pix[((col + 1) * 16) + (row * 2) + 1];
                        }
                        else if (orient == 180)
                        {
                            // from left to right inverted
                            pix[(row * 16) + ((7 - col) * 2)] = pix[(row * 16) + (6 - col) * 2];
                            pix[(row * 16) + ((7 - col) * 2) + 1] = pix[(row * 16) + (6 - col) * 2 + 1];
                        }
                        else if (orient == 270)
                        {
                            // from the top down
                            pix[((7 - col) * 16) + (row * 2)] = pix[((6 - col) * 16) + (row * 2)];
                            pix[((7 - col) * 16) + (row * 2) + 1] = pix[((6 - col) * 16) + (row * 2) + 1];
                        }
                    }
                }

                // add the new line of pixels
                for (row = 0; row < 8; row++)
                {
                    if (orient == 0)
                    {
                        if (char_ind > 5)
                        {
                            pix[(row * 16) + 14] = bg0;
                            pix[(row * 16) + 15] = bg1;
                        }
                        else if (lgrid[char_ind * 16 + (14 - row * 2)] == 0xFF)
                        {
                            pix[(row * 16) + 14] = pix0;
                            pix[(row * 16) + 15] = pix1;
                        }
                        else
                        {
                            pix[(row * 16) + 14] = bg0;
                            pix[(row * 16) + 15] = bg1;
                        }
                    }
                    else if (orient == 90)
                    {
                        if (char_ind > 5)
                        {
                            pix[112 + (14 - row * 2)] = bg0;
                            pix[113 + (14 - row * 2)] = bg1;
                        }
                        else if (lgrid[char_ind * 16 + (14 - row * 2)] == 0xFF)
                        {
                            pix[112 + (14 - row * 2)] = pix0;
                            pix[113 + (14 - row * 2)] = pix1;
                        }
                        else
                        {
                            pix[112 + (14 - row * 2)] = bg0;
                            pix[113 + (14 - row * 2)] = bg1;
                        }
                    }
                    else if (orient == 180)
                    {
                        if (char_ind > 5)
                        {
                            pix[((7 - row) * 16)] = bg0;
                            pix[((7 - row) * 16) + 1] = bg1;
                        }
                        else if (lgrid[char_ind * 16 + (14 - row * 2)] == 0xFF)
                        {
                            pix[((7 - row) * 16)] = pix0;
                            pix[((7 - row) * 16) + 1] = pix1;
                        }
                        else
                        {
                            pix[((7 - row) * 16)] = bg0;
                            pix[((7 - row) * 16) + 1] = bg1;
                        }
                    }
                    else if (orient == 270)
                    {
                        if (char_ind > 5)
                        {
                            pix[row * 2] = bg0;
                            pix[row * 2 + 1] = bg1;
                        }
                        else if (lgrid[char_ind * 16 + (14 - row * 2)] == 0xFF)
                        {
                            pix[row * 2] = pix0;
                            pix[row * 2 + 1] = pix1;
                        }
                        else
                        {
                            pix[row * 2] = bg0;
                            pix[row * 2 + 1] = bg1;
                        }
                    }
                }

                // output the buffer
                fd = fs.openSync (this.fbfile, "r+");
                fs.writeSync (fd, pix, 0, 128, 0);
                fs.closeSync (fd);

                // pause for a bit
                start = new Date().getTime();
                for (i = 0; i < 1e7; i++)
                {
                    if ((new Date().getTime() - start) > 100) break;
                }
            }
        }
    }

    scroll_message_glob (args)
    {
        message = Cast.toString (args.MESSAGE);
        valf = (Math.trunc (this._fg[2] / 32) * 1024) + (Math.trunc (this._fg[0] / 32) * 32) + Math.trunc (this._fg[1] / 32);
        valb = (Math.trunc (this._bg[2] / 32) * 1024) + (Math.trunc (this._bg[0] / 32) * 32) + Math.trunc (this._bg[1] / 32);

        this._message (message, this._orient, valf, valb);
    }

    scroll_message (args)
    {
        message = Cast.toString (args.MESSAGE);
        orient = Cast.toNumber (args.ROT);
        colour = Cast.toString (args.COLOUR);
        bg = Cast.toString (args.BCOLOUR);
        valf = this._map_colour (colour);
        valb = this._map_colour (bg);

        this._message (message, orient, valf, valb);
    }

}

module.exports = Scratch3PiSenseHatBlocks;
