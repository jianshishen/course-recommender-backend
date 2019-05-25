## Info

Project on progress

The backend for course recommender made by Express.js

## Deployment

Local:

0. Open `config.json`. Input the information of database at `connection_dev`.
1. Run `npm install` to install dependencies.
1. Run `npm start` to start the server.
1. The service will be deployed to the link displayed on console.
1. Visit `http://localhost:4000/doc` to read documentation.

Google Cloud Platform:

0. Open `app.yaml`. Input the information of database at `env_variables` and `beta_settings`
1. Configure Cloud SDK.
1. Run `gcloud app deploy` to deploy the build to Google Cloud Platform. Use `-v` to specify version.
