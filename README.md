# check-pull-request-description-checklist

Reads pull request body and makes sure that items are checked or struck out to make reading descriptions easier for maintainers and contributors.

```yaml
inputs:
  checklist-items:
    description: List of newline separated check list items that should be checked our struck out, e.g. `DCO added to all commits`
    required: true
```

## Usage

```yml
name: "PR description check"
on:
  pull_request:
    types:
      - opened
      - edited
      - reopened

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: peternied/check-pull-request-description-checklist@v1.1
        with:
          checklist-items: |
            Added unit test(s)
```

# Changelog

## v1.1
* Ignore items where the checkbox is part of the strike-through by @msfroh

## v1
- Initial Release