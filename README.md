# wellbee

A FHIR enabled patient wellness app.

I wrote this in one day at the HL7 Connectathon in Sydney, March 2025.

## Running locally
```
npm install
npm start
```

## Minify (Optional)
```
npm run build
```

Then serve:
```
npm install -g serve
serve -s build
```


## Deploy to Github Pages

```
npm run deploy
```

This will cause the predeploy and deploy scripts defined in package.json to run.

Under the hood, the predeploy script will build a distributable version of the React app and store it in a folder named build. Then, the deploy script will push the contents of that folder to a new commit on the gh-pages branch of the GitHub repository, creating that branch if it doesn't already exist.

Customise the message via:
```
npm run deploy -- -m "Deploy to gh-pages"
```

See also: https://github.com/gitname/react-gh-pages

