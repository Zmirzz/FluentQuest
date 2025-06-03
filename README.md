# FluentQuest

## Project Description
Players are presented with a common phrase or word in a foreign language. They must guess its meaning and the country of origin. Hints can include contextual usage or related words.

## Installation
1. Clone the repository
   ```bash
   git clone https://github.com/Zmirzz/FluentQuest.git
   cd FluentQuest
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Start the development server
   ```bash
   npm start
   ```
4. Run the web version
   ```bash
   npm run web
   ```

## Building for Web
To generate a production build of the web app run:
```bash
expo export -p web
```

## Troubleshooting
If the web version shows a white screen on startup, it may be related to
`SecureStore` errors. Open your browser's developer console and check for any
messages. Resolving these errors usually fixes the issue.
