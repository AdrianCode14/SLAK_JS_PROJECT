# SLAK

## Without docker compose

_.env must be in backend folder_

### SLAK backend

```bash
    1. cd ./backend/
    2. npm install
    3. npm run dev
```

### SLAK web

```bash
    1. cd ./frontend/slack_web
    2. npm install
    3. npm run dev
```

### SLAK mobile

```bash
    1. cd ./frontend/slack_mobile
    2. npm install
    3. npm run dev
```

## With docker compose

-   _.env must be in root folder_

### Docker if image need to be recreated

```bash
    1. docker compose up --build
```

### Docker normal

```bash
    1. docker compose up
```

### Docker stop

```bash
    1. docker compose down
```

## Plan Controls

_For the plan to be controllable, you must focus the plan (you'll see a green border)_

-   To drag and move the plan press 'Space + Mouse Left'
-   To zoom in or out just 'Scroll'
