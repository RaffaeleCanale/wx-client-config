# wx-client-config
Client that allows to download config files from [wx-service-config](https://github.com/RaffaeleCanale/wx-service-config).

## Installation
```sh
wx install
```

## Usage

### Request a new access token
```sh
wx-client-config --token <domain1> <domain2> ...
```
| Options | Description |
| :-------------: |:-------------|
| `--token` | Array of domains that the token will allow access to |
This will print out a new access key. That key can be included to the project configuration or in the global configuration (ie. `./config.json`).

You will be prompted for the service password.

### Download configuration files
```sh
wx-client-config
```
| Options | Description |
| :-------------: |:-------------|
| `--config` | Name of the config file to load (default: `.wxrc`) |
| `--project` | Name of the project (default: current directory name) |

The configuration file should contain the following properties:
```json
{
    "hostname": "<address of the config service>",
    "token": "<access jwt>",
    "config": [
        "<config filename 1>",
        "<config filename 2>",
        "..."
    ]
}
```
This will download all the files in `config` to the current directory.

Note that any missing property can fallback on the global configuration file located at `./config.json`. This can be useful to avoid specifying the `hostname` and `token` on each project config.
