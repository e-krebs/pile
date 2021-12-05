# How to add a new Service

`serviceName` below is the name of the Service you're adding
> currently, **pocket** is already included

## Oauth Page
- in the `src/pages/oauth` folder, add a new file `serviceName.html`
  - this page can be a copy of the `pocket.html` page in that same folder
  - one thing to change: `service="serviceName"` on the **root** `div`
- in `src/manifest.json`, under `web_accessible_resources`, add this new `./pages/oauth/serviceName.html` page

## Declare Services
- in `src/services` create a new `serviceName` folder
  - the `index.ts` of this folder should export:
    - an object named `serviceName` that adhere to the `Service` interface
      > this obviously means that you have to implement those methods
    - a string literal type whose value is `serviceName`
- in `src/services/index.ts`
  - import both items from the new `serviceName` mentionned above
  - add the **type** to the existing `ServiceNames` type (with a `|`)
  - add the **object** as a key of the existing exported `services` object
