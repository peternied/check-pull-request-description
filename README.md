# check-pull-request-description

A GitHub action ensuring that PRs include specific details in the description.

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
      - uses: peternied/check-pull-request-description@v1
        with:
          checklist-items: |
            Added unit test(s)
```
