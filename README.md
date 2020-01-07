# wx-client-config
Client that allows to download config files from [wx-service-config](https://github.com/RaffaeleCanale/wx-service-config).

## Installation
1. Create the config file at `./config.json` with the following properties:
    - `hostname` - the service hostname
    - `basicAuth` - if needed, the basic auth credentials (eg. "user:password")
2. Install the project
```sh
wx install
```
3. Request a new access token
```sh
wx-client-config generate-token <domain1> <domain2> ...
```
The domains could be, for example, "work all"

4. Get the provied token and add it to the `./config.json` under `token`

###

## Usage
### Pull files
In a project with a `.wxrc` file:
```
wx-client-config --config <config-file> --project <project name> --domain <domain>
```

| Option | Default | Description |
| :-------------:|:-------------|:-------------|
| `--config` | `.wxrc` | Name of the config file to load (default: `.wxrc`) |
| `--project` | currend directory name | Name of the project |
| `--domain` | first match found | Name of the domain to use |
