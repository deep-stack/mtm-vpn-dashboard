# Deploy

## Setup

- Clone the repo and change to the [deploy](./) directory

  ```bash
  git clone git@git.vdb.to:cerc-io/mtm-vpn-dashboard.git
  cd mtm-vpn-dashboard/deploy
  ```

- Build registry CLI image:

  ```bash
  docker build -t cerc/laconic-registry-cli .

  # Builds image cerc/laconic-registry-cli:latest
  ```

- Configure `userKey` in the [registry CLI config](./config.yml):

  - User key should be of the account that owns the `laconic-deploy` authority (owner account address: `laconic1kwx2jm6vscz38qlyujvq6msujmk8l3zangqahs`)

  - Account should also own the bond `5d82586d156fb6671a9170d92f930a72a49a29afb45e30e16fff2100e30776e2`

  ```bash
  nano config.yml
  ```

- Add configuration for registry operations:

  ```bash
  cp .registry.env.example .registry.env

  # Update values if required
  nano .registry.env
  ```

- Add configuration for the app:

  ```bash
  # Create env for deployment from example env
  cp ../.env.example .app.env

  # Fill in the required values
  nano .app.env
  ```

## Run

- Deploy `mtm-vpn-dashboard` App:

  ```bash
  # In mtm-vpn-dashboard/deploy dir
  docker run -it \
  -v ./:/app/deploy -w /app/deploy \
  -e DEPLOYMENT_DNS=mtm-vpn-dashboard \
  cerc/laconic-registry-cli:latest \
  ./deploy.sh
  ```

- Check deployment logs on deployer UI: <https://webapp-deployer-ui.apps.vaasl.io/>

- Visit deployed app: <https://gor-deploy.apps.vaasl.io>

### Remove deployment

- Remove deployment:

  ```bash
  # In gor-deploy/deploy dir
  docker run -it \
  -v ./:/app/deploy -w /app/deploy \
  -e DEPLOYMENT_RECORD_ID=<deploment-record-id-to-be-removed> \
  cerc/laconic-registry-cli:latest \
  ./remove-deployment.sh
  ```

## Troubleshoot

- Check records in [registry console app](https://console.laconic.com/#/registry).

- If deployment fails due to low bond balance
  - Check balances

    ```bash
    # Account balance
    ./laconic-cli.sh account get

    # Bond balance
    ./laconic-cli.sh bond get --id 5d82586d156fb6671a9170d92f930a72a49a29afb45e30e16fff2100e30776e2
    ```

  - Command to refill bond

    ```bash
    ./laconic-cli.sh bond refill --id 5d82586d156fb6671a9170d92f930a72a49a29afb45e30e16fff2100e30776e2 --type alnt --quantity 10000000
    ```
